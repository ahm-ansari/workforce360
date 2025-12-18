from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Department, Designation, Employee
from .serializers import (
    DepartmentSerializer, DesignationSerializer, 
    EmployeeSerializer, EmployeeCreateSerializer
)
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.select_related('department').all()
    serializer_class = DesignationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department']
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related(
        'user', 'department', 'designation'
    ).all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'designation']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['user__username', 'date_of_joining']
    ordering = ['user__username']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EmployeeCreateSerializer
        return EmployeeSerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get employee statistics"""
        total = self.queryset.count()
        by_department = {}
        for dept in Department.objects.all():
            by_department[dept.name] = dept.employee_set.count()
        
        return Response({
            'total_employees': total,
            'by_department': by_department
        })
