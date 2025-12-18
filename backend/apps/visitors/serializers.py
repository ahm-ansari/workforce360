from rest_framework import serializers
from .models import Visitor, GateEntry, Vehicle, Company

class VisitorSerializer(serializers.ModelSerializer):
    host_employee_name = serializers.CharField(source='host_employee.user.get_full_name', read_only=True)
    is_checked_out = serializers.BooleanField(read_only=True)

    class Meta:
        model = Visitor
        fields = '__all__'
        read_only_fields = ('check_in_time', 'created_at', 'updated_at')

class GateEntrySerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source='visitor.name', read_only=True)
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = GateEntry
        fields = '__all__'
        read_only_fields = ('entry_time', 'created_at', 'updated_at')

class VehicleSerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source='visitor.name', read_only=True)
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class CompanySerializer(serializers.ModelSerializer):
    from apps.projects.serializers import ServiceSerializer, SolutionSerializer, ProjectListSerializer
    
    services_details = ServiceSerializer(source='services', many=True, read_only=True)
    solutions_details = SolutionSerializer(source='solutions', many=True, read_only=True)
    projects_list = ProjectListSerializer(source='projects', many=True, read_only=True)
    
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

