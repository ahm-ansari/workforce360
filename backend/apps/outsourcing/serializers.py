from rest_framework import serializers
from .models import StaffingRequest, OutsourcedStaff, StaffingContract, StaffingTimesheet
from apps.employees.models import Employee
from apps.visitors.models import Company

class CompanyShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']

class EmployeeShortSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    class Meta:
        model = Employee
        fields = ['id', 'full_name']

class StaffingRequestSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = StaffingRequest
        fields = '__all__'

class OutsourcedStaffSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    request_title = serializers.CharField(source='staffing_request.title', read_only=True)
    
    class Meta:
        model = OutsourcedStaff
        fields = '__all__'

class StaffingContractSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    
    class Meta:
        model = StaffingContract
        fields = '__all__'

class StaffingTimesheetSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='placement.employee.user.get_full_name', read_only=True)
    client_name = serializers.CharField(source='placement.client.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = StaffingTimesheet
        fields = '__all__'
