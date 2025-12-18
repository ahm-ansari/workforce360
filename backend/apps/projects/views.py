from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import Service, Solution, Project, ProjectMilestone, ProjectDocument
from .serializers import (
    ServiceSerializer, SolutionSerializer, ProjectSerializer, 
    ProjectListSerializer, ProjectMilestoneSerializer, ProjectDocumentSerializer
)


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for managing services"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'pricing_type', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'base_price']
    ordering = ['name']


class SolutionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing solutions"""
    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'target_industry']
    search_fields = ['name', 'description', 'technology_stack']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for managing projects"""
    queryset = Project.objects.select_related(
        'company', 'service', 'solution', 'project_manager'
    ).prefetch_related('team_members', 'milestones', 'documents')
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'company', 'service', 'solution', 'project_manager']
    search_fields = ['name', 'description', 'company__name']
    ordering_fields = ['name', 'start_date', 'end_date', 'created_at', 'budget']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use lightweight serializer for list view"""
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer
    
    def perform_create(self, serializer):
        """Set created_by to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get project statistics"""
        queryset = self.filter_queryset(self.get_queryset())
        
        stats = {
            'total_projects': queryset.count(),
            'by_status': {},
            'by_priority': {},
            'total_budget': 0,
            'total_actual_cost': 0,
            'overbudget_count': 0,
        }
        
        # Count by status
        for status_choice in Project.STATUS_CHOICES:
            status_code = status_choice[0]
            stats['by_status'][status_code] = queryset.filter(status=status_code).count()
        
        # Count by priority
        for priority_choice in Project.PRIORITY_CHOICES:
            priority_code = priority_choice[0]
            stats['by_priority'][priority_code] = queryset.filter(priority=priority_code).count()
        
        # Calculate budget stats
        for project in queryset:
            if project.budget:
                stats['total_budget'] += float(project.budget)
            if project.actual_cost:
                stats['total_actual_cost'] += float(project.actual_cost)
            if project.is_overbudget:
                stats['overbudget_count'] += 1
        
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def add_team_member(self, request, pk=None):
        """Add a team member to the project"""
        project = self.get_object()
        employee_id = request.data.get('employee_id')
        
        if not employee_id:
            return Response(
                {'error': 'employee_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from apps.employees.models import Employee
            employee = Employee.objects.get(id=employee_id)
            project.team_members.add(employee)
            return Response({'message': 'Team member added successfully'})
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_team_member(self, request, pk=None):
        """Remove a team member from the project"""
        project = self.get_object()
        employee_id = request.data.get('employee_id')
        
        if not employee_id:
            return Response(
                {'error': 'employee_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from apps.employees.models import Employee
            employee = Employee.objects.get(id=employee_id)
            project.team_members.remove(employee)
            return Response({'message': 'Team member removed successfully'})
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class ProjectMilestoneViewSet(viewsets.ModelViewSet):
    """ViewSet for managing project milestones"""
    queryset = ProjectMilestone.objects.select_related('project')
    serializer_class = ProjectMilestoneSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'created_at']
    ordering = ['due_date']
    
    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Mark milestone as completed"""
        milestone = self.get_object()
        milestone.status = 'COMPLETED'
        milestone.completion_date = timezone.now().date()
        milestone.save()
        serializer = self.get_serializer(milestone)
        return Response(serializer.data)


class ProjectDocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing project documents"""
    queryset = ProjectDocument.objects.select_related('project', 'uploaded_by')
    serializer_class = ProjectDocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'document_type']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        """Set uploaded_by to current user"""
        serializer.save(uploaded_by=self.request.user)
