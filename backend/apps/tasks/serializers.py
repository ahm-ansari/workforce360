from rest_framework import serializers
from .models import Task, ActivityLog
from apps.employees.serializers import EmployeeSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ActivityLogSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'task', 'user', 'user_details', 'action', 'timestamp']
        read_only_fields = ['timestamp']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_details = EmployeeSerializer(source='assigned_to', read_only=True)
    assigned_by_details = UserSerializer(source='assigned_by', read_only=True)
    activities = ActivityLogSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 
            'assigned_to', 'assigned_to_details',
            'assigned_by', 'assigned_by_details',
            'status', 'priority', 'due_date',
            'created_at', 'updated_at',
            'activities'
        ]
        read_only_fields = ['created_at', 'updated_at', 'assigned_by']

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'title', 'description', 'assigned_to', 
            'status', 'priority', 'due_date'
        ]
