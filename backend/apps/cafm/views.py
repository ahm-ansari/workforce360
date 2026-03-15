from datetime import timedelta, datetime
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg, Sum, F, Q
from django.utils import timezone
from .models import (
    Facility, Space, Asset, MaintenanceRequest, MaintenanceLog, 
    BMSDevice, BMSTelemetry, PPMSchedule, TechnicianTraining, SystemAudit,
    CAFMAuditLog, MaintenanceCommunication, Vendor, SLAPolicy, 
    WorkOrderStep, InventoryItem
)
from .serializers import (
    FacilitySerializer, SpaceSerializer, AssetSerializer,
    MaintenanceRequestSerializer, MaintenanceLogSerializer,
    BMSDeviceSerializer, BMSTelemetrySerializer,
    PPMScheduleSerializer, TechnicianTrainingSerializer,
    SystemAuditSerializer, CAFMAuditLogSerializer,
    MaintenanceCommunicationSerializer, VendorSerializer,
    SLAPolicySerializer, WorkOrderStepSerializer, InventoryItemSerializer
)

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]

class SLAPolicyViewSet(viewsets.ModelViewSet):
    queryset = SLAPolicy.objects.all()
    serializer_class = SLAPolicySerializer
    permission_classes = [IsAuthenticated]

class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all().order_by('-created_at')
    serializer_class = FacilitySerializer
    permission_classes = [IsAuthenticated]

class SpaceViewSet(viewsets.ModelViewSet):
    queryset = Space.objects.all().order_by('-created_at')
    serializer_class = SpaceSerializer
    permission_classes = [IsAuthenticated]

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by('-created_at')
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def maintenance_history(self, request, pk=None):
        asset = self.get_object()
        history = MaintenanceRequest.objects.filter(asset=asset).order_by('-created_at')
        serializer = MaintenanceRequestSerializer(history, many=True)
        return Response(serializer.data)

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all().order_by('-created_at')
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save(reported_by=self.request.user)
        # Auto-set SLA deadlines if policy is provided
        if instance.sla_policy:
            now = timezone.now()
            instance.sla_response_deadline = now + timedelta(hours=instance.sla_policy.response_time_hours)
            instance.sla_resolution_deadline = now + timedelta(hours=instance.sla_policy.resolution_time_hours)
            instance.save()

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        instance = self.get_object()
        instance.status = 'IN_PROGRESS'
        instance.responded_at = timezone.now()
        instance.save()
        MaintenanceLog.objects.create(
            request=instance,
            user=request.user,
            status_change="IN_PROGRESS",
            comment="Work order acknowledged and started."
        )
        return Response({'status': 'Acknowledged'})

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        instance = self.get_object()
        instance.status = 'RESOLVED'
        instance.resolved_at = timezone.now()
        instance.save()
        MaintenanceLog.objects.create(
            request=instance,
            user=request.user,
            status_change="RESOLVED",
            comment="Work order resolved."
        )
        return Response({'status': 'Resolved'})

class WorkOrderStepViewSet(viewsets.ModelViewSet):
    queryset = WorkOrderStep.objects.all()
    serializer_class = WorkOrderStepSerializer
    permission_classes = [IsAuthenticated]

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]

class MaintenanceLogViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceLog.objects.all().order_by('-created_at')
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsAuthenticated]

class PPMScheduleViewSet(viewsets.ModelViewSet):
    queryset = PPMSchedule.objects.all().order_by('next_due_date')
    serializer_class = PPMScheduleSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def generate_work_order(self, request, pk=None):
        schedule = self.get_object()
        
        maintenance_request = MaintenanceRequest.objects.create(
            title=f"PPM: {schedule.task_name}",
            description=f"Automated Preventive Maintenance for {schedule.asset.name}.\n\nTasks:\n{schedule.description}",
            request_type='PPM',
            facility=schedule.asset.facility,
            space=schedule.asset.space,
            asset=schedule.asset,
            priority='MEDIUM',
            status='OPEN',
            due_date=schedule.next_due_date,
            sla_policy=schedule.sla_policy,
            assigned_to=schedule.assigned_to,
            vendor=schedule.vendor
        )
        
        schedule.last_completed_date = schedule.next_due_date
        
        if schedule.frequency == 'DAILY':
            schedule.next_due_date += timedelta(days=1)
        elif schedule.frequency == 'WEEKLY':
            schedule.next_due_date += timedelta(days=7)
        elif schedule.frequency == 'MONTHLY':
            schedule.next_due_date += timedelta(days=30)
        elif schedule.frequency == 'QUARTERLY':
            schedule.next_due_date += timedelta(days=90)
        elif schedule.frequency == 'YEARLY':
            schedule.next_due_date += timedelta(days=365)
            
        schedule.save()
        
        return Response({
            'status': 'Work order generated',
            'work_order_id': maintenance_request.id
        }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def cafm_analytics(request):
    """
    Enhanced Reporting and Analytics endpoint.
    """
    total_assets = Asset.objects.count()
    active_requests = MaintenanceRequest.objects.exclude(status__in=['CLOSED', 'RESOLVED']).count()
    
    # SLA Compliance Calculation
    total_resolved = MaintenanceRequest.objects.filter(status__in=['RESOLVED', 'CLOSED']).count()
    within_sla = MaintenanceRequest.objects.filter(
        status__in=['RESOLVED', 'CLOSED'],
        resolved_at__lte=F('sla_resolution_deadline')
    ).count()
    
    sla_compliance_rate = (within_sla / total_resolved * 100) if total_resolved > 0 else 100
    
    # Cost Analysis
    total_estimated_cost = MaintenanceRequest.objects.aggregate(Sum('estimated_cost'))['estimated_cost__sum'] or 0
    total_actual_cost = MaintenanceRequest.objects.aggregate(Sum('actual_cost'))['actual_cost__sum'] or 0
    
    # Asset Lifecycle
    avg_asset_age = Asset.objects.all() # Complex to do in DB with properties, but we can sample
    
    return Response({
        'summary': {
            'total_assets': total_assets,
            'active_requests': active_requests,
            'sla_compliance_rate': round(sla_compliance_rate, 1),
            'total_actual_cost': total_actual_cost,
            'cost_variance': total_actual_cost - total_estimated_cost
        },
        'request_status_distribution': MaintenanceRequest.objects.values('status').annotate(count=Count('status')),
        'asset_category_distribution': Asset.objects.values('category').annotate(count=Count('category')),
        'inventory_alerts': InventoryItem.objects.filter(quantity__lte=F('min_quantity')).values('name', 'quantity', 'min_quantity')
    })

# Add missing ViewSets
class BMSDeviceViewSet(viewsets.ModelViewSet):
    queryset = BMSDevice.objects.all().order_by('-created_at')
    serializer_class = BMSDeviceSerializer
    permission_classes = [IsAuthenticated]

class BMSTelemetryViewSet(viewsets.ModelViewSet):
    queryset = BMSTelemetry.objects.all().order_by('-timestamp')
    serializer_class = BMSTelemetrySerializer
    permission_classes = [IsAuthenticated]

class TechnicianTrainingViewSet(viewsets.ModelViewSet):
    queryset = TechnicianTraining.objects.all().order_by('-completion_date')
    serializer_class = TechnicianTrainingSerializer
    permission_classes = [IsAuthenticated]

class SystemAuditViewSet(viewsets.ModelViewSet):
    queryset = SystemAudit.objects.all().order_by('-audit_date')
    serializer_class = SystemAuditSerializer
    permission_classes = [IsAuthenticated]

class CAFMAuditLogViewSet(viewsets.ModelViewSet):
    queryset = CAFMAuditLog.objects.all().order_by('-timestamp')
    serializer_class = CAFMAuditLogSerializer
    permission_classes = [IsAuthenticated]

class MaintenanceCommunicationViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceCommunication.objects.all().order_by('created_at')
    serializer_class = MaintenanceCommunicationSerializer
    permission_classes = [IsAuthenticated]
