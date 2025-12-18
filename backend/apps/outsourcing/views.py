from rest_framework import viewsets, permissions
from .models import StaffingRequest, OutsourcedStaff, StaffingContract, StaffingTimesheet
from .serializers import (
    StaffingRequestSerializer, 
    OutsourcedStaffSerializer, 
    StaffingContractSerializer, 
    StaffingTimesheetSerializer
)

from rest_framework.decorators import action
from rest_framework.response import Response

class StaffingRequestViewSet(viewsets.ModelViewSet):
    queryset = StaffingRequest.objects.all()
    serializer_class = StaffingRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        return Response({
            'active_placements': OutsourcedStaff.objects.filter(status='ACTIVE').count(),
            'open_requests': StaffingRequest.objects.filter(status='OPEN').count(),
            'active_contracts': StaffingContract.objects.filter(status='ACTIVE').count(),
            'pending_timesheets': StaffingTimesheet.objects.filter(status='SUBMITTED').count(),
        })

class OutsourcedStaffViewSet(viewsets.ModelViewSet):
    queryset = OutsourcedStaff.objects.all()
    serializer_class = OutsourcedStaffSerializer
    permission_classes = [permissions.IsAuthenticated]

class StaffingContractViewSet(viewsets.ModelViewSet):
    queryset = StaffingContract.objects.all()
    serializer_class = StaffingContractSerializer
    permission_classes = [permissions.IsAuthenticated]

class StaffingTimesheetViewSet(viewsets.ModelViewSet):
    queryset = StaffingTimesheet.objects.all()
    serializer_class = StaffingTimesheetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        if 'status' in self.request.data and self.request.data['status'] == 'APPROVED':
            from django.utils import timezone
            serializer.save(approved_by=self.request.user, approval_date=timezone.now())
        else:
            serializer.save()
