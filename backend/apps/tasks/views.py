from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, ActivityLog
from .serializers import TaskSerializer, TaskCreateSerializer, ActivityLogSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related('assigned_to', 'assigned_by').prefetch_related('activities').all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'assigned_to']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'created_at', 'priority']

    def get_serializer_class(self):
        if self.action == 'create':
            return TaskCreateSerializer
        return TaskSerializer

    def perform_create(self, serializer):
        task = serializer.save(assigned_by=self.request.user)
        ActivityLog.objects.create(
            task=task,
            user=self.request.user,
            action=f"Created task '{task.title}'"
        )

    def perform_update(self, serializer):
        # Track status change
        instance = self.get_object()
        old_status = instance.status
        task = serializer.save()
        
        if old_status != task.status:
            ActivityLog.objects.create(
                task=task,
                user=self.request.user,
                action=f"Changed status from {old_status} to {task.status}"
            )
        else:
            ActivityLog.objects.create(
                task=task,
                user=self.request.user,
                action="Updated task details"
            )

    @action(detail=True, methods=['post'])
    def log_activity(self, request, pk=None):
        task = self.get_object()
        action_text = request.data.get('action')
        if not action_text:
            return Response({'error': 'Action text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        ActivityLog.objects.create(
            task=task,
            user=request.user,
            action=action_text
        )
        return Response({'status': 'Activity logged'})

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.select_related('user', 'task').all()
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['task', 'user']
