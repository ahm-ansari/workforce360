from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import TicketCategory, SupportTicket, TicketMessage
from .serializers import (
    TicketCategorySerializer, SupportTicketSerializer, 
    SupportTicketDetailSerializer, TicketMessageSerializer
)
from django.utils import timezone

class TicketCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TicketCategory.objects.all()
    serializer_class = TicketCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

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

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, ticket=ticket)
            ticket.updated_at = timezone.now()
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
