from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.employees.models import Employee
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from .models import Attendance, LeaveType, Leave, DocumentCategory, Document
from .serializers import (
    AttendanceSerializer, AttendanceCreateSerializer,
    LeaveTypeSerializer,
    LeaveSerializer, LeaveCreateSerializer,
    DocumentCategorySerializer,
    DocumentSerializer, DocumentUploadSerializer
)

class AttendanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Attendance.objects.none() # Required for DjangoModelPermissions and router introspection
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['employee', 'date', 'status', 'employee__department', 'employee__designation']
    search_fields = ['employee__user__first_name', 'employee__user__last_name', 'employee__user__username']
    ordering_fields = ['date', 'check_in', 'work_hours']
    ordering = ['-date']

    def get_queryset(self):
        user = self.request.user
        queryset = Attendance.objects.select_related('employee', 'employee__user')

        # Date Range Filtering for Calendar View
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        elif start_date:
            queryset = queryset.filter(date__gte=start_date)
        elif end_date:
            queryset = queryset.filter(date__lte=end_date)

        if self.request.query_params.get('mine') == 'true':
            if hasattr(user, 'employee'):
                return queryset.filter(employee=user.employee)
            return Attendance.objects.none()

        if user.is_staff or user.is_superuser:
            return queryset.all()
        
        # For regular employees, only return their own records
        if hasattr(user, 'employee'):
            return queryset.filter(employee=user.employee)
        
        # If user has no employee profile and is not staff, return empty
        return Attendance.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return AttendanceCreateSerializer
        return AttendanceSerializer

    def perform_create(self, serializer):
        try:
            employee = self.request.user.employee
            serializer.save(employee=employee)
        except AttributeError:
             # Handle case where user is admin or has no employee profile
             # For now, let it raise or handle gracefully if critical
            raise serializers.ValidationError({"error": "User does not have an associated employee profile."})

    # Removed deprecated check_in action in favor of standard create

    @action(detail=False, methods=['post'])
    def bulk_generate(self, request):
        date_str = request.data.get('date')
        status_val = request.data.get('status', 'PRESENT')
        records = request.data.get('records') # List of { employee_id: 1, status: 'PRESENT' }
        
        if not date_str:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        created_count = 0
        existing_count = 0
        updated_count = 0

        if records and isinstance(records, list):
            # Selective/Detailed List Mode
            for record_data in records:
                emp_id = record_data.get('employee_id')
                rec_status = record_data.get('status', status_val)
                
                if not emp_id:
                    continue
                    
                try:
                    emp = Employee.objects.get(id=emp_id)
                    attendance, created = Attendance.objects.update_or_create(
                        employee=emp,
                        date=date_str,
                        defaults={'status': rec_status}
                    )
                    if created:
                        created_count += 1
                    else:
                        updated_count += 1
                except Employee.DoesNotExist:
                    continue
            
            return Response({
                'message': f'Attendance processed. Created: {created_count}, Updated: {updated_count}',
                'created': created_count,
                'updated': updated_count
            })
        else:
            # Legacy/Simple Mode (All Same Status)
            active_employees = Employee.objects.filter(user__is_active=True)
            for emp in active_employees:
                if not Attendance.objects.filter(employee=emp, date=date_str).exists():
                    Attendance.objects.create(
                        employee=emp,
                        date=date_str,
                        status=status_val
                    )
                    created_count += 1
                else:
                    existing_count += 1
                    
            return Response({
                'message': f'Attendance generated successfully. Created: {created_count}, Skipped: {existing_count}',
                'created': created_count,
                'skipped': existing_count
            })

class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.filter(is_active=True)
    serializer_class = LeaveTypeSerializer
    permission_classes = [IsAuthenticated]

class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.select_related('employee', 'leave_type', 'approved_by').all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['employee', 'status', 'leave_type', 'employee__department', 'employee__designation']
    search_fields = ['employee__user__first_name', 'employee__user__last_name', 'reason']
    ordering_fields = ['start_date', 'end_date', 'days_count', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return LeaveCreateSerializer
        return LeaveSerializer

    def perform_create(self, serializer):
        # Calculate days count
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        days_count = (end_date - start_date).days + 1
        serializer.save(days_count=days_count)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'APPROVED'
        leave.approved_by = request.user
        leave.approval_date = timezone.now()
        leave.save()
        return Response(LeaveSerializer(leave).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'REJECTED'
        leave.approved_by = request.user
        leave.approval_date = timezone.now()
        leave.rejection_reason = request.data.get('reason', '')
        leave.save()
        return Response(LeaveSerializer(leave).data)

class DocumentCategoryViewSet(viewsets.ModelViewSet):
    queryset = DocumentCategory.objects.filter(is_active=True)
    serializer_class = DocumentCategorySerializer
    permission_classes = [IsAuthenticated]

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related('employee', 'category', 'uploaded_by').all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['employee', 'category', 'is_confidential']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentUploadSerializer
        return DocumentSerializer

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
