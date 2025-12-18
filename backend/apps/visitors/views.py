from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Visitor, GateEntry, Vehicle, Company
from .serializers import VisitorSerializer, GateEntrySerializer, VehicleSerializer, CompanySerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.select_related('host_employee').all()
    serializer_class = VisitorSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['host_employee']
    search_fields = ['name', 'company', 'phone', 'email']
    ordering_fields = ['check_in_time', 'check_out_time']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by checked-in status
        checked_in = self.request.query_params.get('checked_in', None)
        if checked_in == 'true':
            queryset = queryset.filter(check_out_time__isnull=True)
        elif checked_in == 'false':
            queryset = queryset.filter(check_out_time__isnull=False)
        return queryset

    @action(detail=True, methods=['post'])
    def check_out(self, request, pk=None):
        """Record visitor check-out time."""
        visitor = self.get_object()
        if visitor.check_out_time:
            return Response(
                {"detail": "Visitor already checked out."},
                status=status.HTTP_400_BAD_REQUEST
            )
        visitor.check_out_time = timezone.now()
        visitor.save()
        return Response({"detail": "Visitor checked out successfully."})

class GateEntryViewSet(viewsets.ModelViewSet):
    queryset = GateEntry.objects.select_related('visitor', 'employee').all()
    serializer_class = GateEntrySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['entry_type', 'gate_number']
    search_fields = ['visitor__name', 'employee__first_name', 'employee__last_name']
    ordering_fields = ['entry_time', 'exit_time']

    @action(detail=True, methods=['post'])
    def record_exit(self, request, pk=None):
        """Record exit time for a gate entry."""
        entry = self.get_object()
        if entry.exit_time:
            return Response(
                {"detail": "Exit already recorded."},
                status=status.HTTP_400_BAD_REQUEST
            )
        entry.exit_time = timezone.now()
        entry.save()
        return Response({"detail": "Exit recorded successfully."})

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.select_related('visitor', 'employee').all()
    serializer_class = VehicleSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['vehicle_type', 'visitor', 'employee']
    search_fields = ['vehicle_number', 'parking_slot']
    ordering_fields = ['created_at']

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'email', 'phone', 'industry']
    ordering_fields = ['name', 'created_at']
