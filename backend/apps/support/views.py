from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import TicketCategory, SupportTicket, TicketMessage, EscalationMatrix
from .serializers import (
    TicketCategorySerializer, SupportTicketSerializer, 
    SupportTicketDetailSerializer, TicketMessageSerializer,
    EscalationMatrixSerializer
)
from django.utils import timezone

class TicketCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TicketCategory.objects.all()
    serializer_class = TicketCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class EscalationMatrixViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EscalationMatrix.objects.all()
    serializer_class = EscalationMatrixSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department']

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description', 'ticket_id']
    ordering_fields = ['created_at', 'updated_at', 'priority']

    def get_queryset(self):
        user = self.request.user
        # Staff can see all tickets, regular users only their own
        if user.is_staff:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SupportTicketDetailSerializer
        return SupportTicketSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        new_assigned_to = self.request.data.get('assigned_to')
        if new_assigned_to and not instance.assigned_at:
            serializer.save(assigned_at=timezone.now())
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, ticket=ticket)
            
            # Update timing
            now = timezone.now()
            ticket.updated_at = now
            if request.user.is_staff and not ticket.first_response_at:
                ticket.first_response_at = now
            
            ticket.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        ticket = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(SupportTicket.STATUS_CHOICES):
            ticket.status = new_status
            if new_status in ['RESOLVED', 'CLOSED']:
                ticket.resolved_at = timezone.now()
            ticket.save()
            return Response({'status': 'Ticket status updated'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        stats = {
            'total': queryset.count(),
            'open': queryset.filter(status='OPEN').count(),
            'in_progress': queryset.filter(status='IN_PROGRESS').count(),
            'resolved': queryset.filter(status='RESOLVED').count(),
            'closed': queryset.filter(status='CLOSED').count(),
        }
        return Response(stats)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        from django.db.models import Count, Avg, F, DurationField, ExpressionWrapper
        from django.db.models.functions import TruncDate
        from datetime import timedelta
        
        queryset = self.get_queryset()
        
        # 1. Priority Distribution
        priority_dist = queryset.values('priority').annotate(count=Count('priority'))
        
        # 2. Category Distribution
        category_dist = queryset.values('category__name').annotate(count=Count('id'))
        
        # 3. Volume Trend (Last 30 days)
        last_30_days = timezone.now() - timedelta(days=30)
        volume_trend = (
            queryset.filter(created_at__gte=last_30_days)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        
        # 4. Performance Metrics (in seconds)
        # Avg Response Time
        response_time_expr = ExpressionWrapper(
            F('first_response_at') - F('created_at'),
            output_field=DurationField()
        )
        avg_response = queryset.exclude(first_response_at__isnull=True).annotate(
            duration=response_time_expr
        ).aggregate(avg=Avg('duration'))['avg']
        
        # Avg Resolution Time
        resolution_time_expr = ExpressionWrapper(
            F('resolved_at') - F('created_at'),
            output_field=DurationField()
        )
        avg_resolution = queryset.exclude(resolved_at__isnull=True).annotate(
            duration=resolution_time_expr
        ).aggregate(avg=Avg('duration'))['avg']
        
        # 5. SLA Compliance (Resolved within 24h)
        total_resolved = queryset.filter(status__in=['RESOLVED', 'CLOSED']).count()
        sla_compliant = queryset.filter(
            status__in=['RESOLVED', 'CLOSED'],
            resolved_at__lte=F('created_at') + timedelta(hours=24)
        ).count()
        
        sla_rate = (sla_compliant / total_resolved * 100) if total_resolved > 0 else 0

        return Response({
            'priority_distribution': priority_dist,
            'category_distribution': category_dist,
            'volume_trend': volume_trend,
            'performance': {
                'avg_response_seconds': avg_response.total_seconds() if avg_response else 0,
                'avg_resolution_seconds': avg_resolution.total_seconds() if avg_resolution else 0,
                'sla_compliance_rate': round(sla_rate, 1)
            }
        })
