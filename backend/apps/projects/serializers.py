from rest_framework import serializers
from .models import Service, Solution, Project, ProjectMilestone, ProjectDocument
from apps.visitors.models import Company
from apps.employees.models import Employee


class ServiceSerializer(serializers.ModelSerializer):
    companies = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Company.objects.all(), 
        required=False
    )
    
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class SolutionSerializer(serializers.ModelSerializer):
    companies = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Company.objects.all(), 
        required=False
    )
    
    class Meta:
        model = Solution
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = ProjectMilestone
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ProjectDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    
    class Meta:
        model = ProjectDocument
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'uploaded_by']


class ProjectSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    solution_name = serializers.CharField(source='solution.name', read_only=True)
    project_manager_name = serializers.SerializerMethodField()
    team_members_details = serializers.SerializerMethodField()
    is_overbudget = serializers.ReadOnlyField()
    budget_utilization = serializers.ReadOnlyField()
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def get_project_manager_name(self, obj):
        if obj.project_manager:
            return f"{obj.project_manager.user.first_name} {obj.project_manager.user.last_name}"
        return None
    
    def get_team_members_details(self, obj):
        return [
            {
                'id': member.id,
                'name': f"{member.user.first_name} {member.user.last_name}",
                'department': member.department.name if member.department else None
            }
            for member in obj.team_members.all()
        ]


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing projects"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    project_manager_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'company', 'company_name', 'service', 'service_name',
            'status', 'priority', 'start_date', 'end_date', 'budget', 
            'actual_cost', 'project_manager', 'project_manager_name', 'created_at'
        ]
    
    def get_project_manager_name(self, obj):
        if obj.project_manager:
            return f"{obj.project_manager.user.first_name} {obj.project_manager.user.last_name}"
        return None
