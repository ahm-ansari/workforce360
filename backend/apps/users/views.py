from rest_framework import viewsets, status
from django.contrib.auth import get_user_model
from .models import Role, Notification
from .serializers import UserSerializer, RoleSerializer, NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from apps.employees.models import Employee, Department
from apps.tasks.models import Task
from apps.hr.models import Leave
from apps.recruitment.models import Job, Candidate
from apps.visitors.models import Visitor
from apps.sales.models import Invoice, Quotation
from apps.cafm.models import MaintenanceRequest
from apps.projects.models import Project
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Return the current authenticated user's details."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'count': count})

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Get summarized stats for all modules"""
        today = timezone.now().date()
        last_30_days = today - timedelta(days=30)

        # Employee & Dept Stats
        total_employees = Employee.objects.count()
        dept_stats = Department.objects.annotate(employee_count=Count('employee')).values('name', 'employee_count')

        # Task Stats
        task_stats = {
            'pending': Task.objects.exclude(status='COMPLETED').count(),
            'completed': Task.objects.filter(status='COMPLETED').count(),
        }

        # HR Stats
        leave_stats = {
            'pending': Leave.objects.filter(status='PENDING').count(),
            'on_leave': Leave.objects.filter(status='APPROVED', start_date__lte=today, end_date__gte=today).count(),
        }

        # Recruitment Stats
        job_stats = {
            'active': Job.objects.filter(status='PUBLISHED').count(),
            'total_candidates': Candidate.objects.count(),
        }

        # Sales Stats
        revenue_stats = Invoice.objects.filter(status='PAID').aggregate(total=Sum('total_amount'))['total'] or 0
        quotation_stats = {
            'pending': Quotation.objects.filter(status='SENT').count(),
            'accepted': Quotation.objects.filter(status='ACCEPTED').count(),
        }

        # CAFM Stats
        cafm_stats = {
            'open_requests': MaintenanceRequest.objects.exclude(status='CLOSED').count(),
            'by_priority': MaintenanceRequest.objects.values('priority').annotate(count=Count('id')),
        }

        # Project Stats
        project_stats = {
            'active': Project.objects.filter(status='IN_PROGRESS').count(),
            'planning': Project.objects.filter(status='PLANNING').count(),
        }

        # Visitors
        visitor_stats = {
            'active_today': Visitor.objects.filter(check_in_time__date=today).count(),
        }

        return Response({
            'employees': {
                'total': total_employees,
                'by_department': list(dept_stats)
            },
            'tasks': task_stats,
            'hr': leave_stats,
            'recruitment': job_stats,
            'sales': {
                'total_revenue': revenue_stats,
                'quotations': quotation_stats
            },
            'cafm': cafm_stats,
            'projects': project_stats,
            'visitors': visitor_stats
        })
