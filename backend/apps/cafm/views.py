from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Avg
from .models import (
    Facility, Space, Asset, MaintenanceRequest, MaintenanceLog, 
    BMSDevice, BMSTelemetry, PPMSchedule, TechnicianTraining, SystemAudit,
    CAFMAuditLog, MaintenanceCommunication
)
from .serializers import (
    FacilitySerializer,
    SpaceSerializer,
    AssetSerializer,
    MaintenanceRequestSerializer,
    MaintenanceLogSerializer,
    BMSDeviceSerializer,
    BMSTelemetrySerializer,
    PPMScheduleSerializer,
    TechnicianTrainingSerializer,
    SystemAuditSerializer,
    CAFMAuditLogSerializer,
    MaintenanceCommunicationSerializer
)

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

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all().order_by('-created_at')
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        old_status = instance.status
        new_instance = serializer.save()
        new_status = new_instance.status

        if old_status != new_status:
            MaintenanceLog.objects.create(
                request=new_instance,
                user=self.request.user,
                status_change=f"{old_status} -> {new_status}",
                comment=f"Status updated from {old_status} to {new_status}"
            )

class MaintenanceLogViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceLog.objects.all().order_by('-created_at')
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsAuthenticated]

class BMSDeviceViewSet(viewsets.ModelViewSet):
    queryset = BMSDevice.objects.all().order_by('-created_at')
    serializer_class = BMSDeviceSerializer
    permission_classes = [IsAuthenticated]

class BMSTelemetryViewSet(viewsets.ModelViewSet):
    queryset = BMSTelemetry.objects.all().order_by('-timestamp')
    serializer_class = BMSTelemetrySerializer
    permission_classes = [IsAuthenticated]

class PPMScheduleViewSet(viewsets.ModelViewSet):
    queryset = PPMSchedule.objects.all().order_by('next_due_date')
    serializer_class = PPMScheduleSerializer
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

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

@api_view(['GET'])
def cafm_analytics(request):
    """
    Reporting and Analytics endpoint.
    """
    total_assets = Asset.objects.count()
    active_requests = MaintenanceRequest.objects.exclude(status='CLOSED').count()
    compliance_avg = SystemAudit.objects.aggregate(Avg('score'))['score__avg'] or 0
    ppm_completion = PPMSchedule.objects.filter(last_completed_date__isnull=False).count()
    
    # Category distribution
    categories = Asset.objects.values('category').annotate(count=Count('category')).order_by('-count')
    
    return Response({
        'summary': {
            'total_assets': total_assets,
            'active_requests': active_requests,
            'compliance_score': round(compliance_avg, 1),
            'ppm_completion': ppm_completion
        },
        'asset_distribution': categories
    })
