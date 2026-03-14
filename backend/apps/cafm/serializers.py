from rest_framework import serializers
from .models import (
    Facility, Space, Asset, MaintenanceRequest, MaintenanceLog, 
    BMSDevice, BMSTelemetry, PPMSchedule, TechnicianTraining, SystemAudit,
    CAFMAuditLog, MaintenanceCommunication
)

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'

class SpaceSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)

    class Meta:
        model = Space
        fields = '__all__'

class MaintenanceLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True, default='')

    class Meta:
        model = MaintenanceLog
        fields = '__all__'

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    space_name = serializers.CharField(source='space.name', read_only=True)
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.get_full_name', read_only=True, default='')
    assigned_to_name = serializers.CharField(source='assigned_to.user.get_full_name', read_only=True, default='')
    logs = MaintenanceLogSerializer(many=True, read_only=True)

    class Meta:
        model = MaintenanceRequest
        fields = '__all__'

class AssetSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    space_name = serializers.CharField(source='space.name', read_only=True)
    maintenance_history = MaintenanceRequestSerializer(source='maintenance_requests', many=True, read_only=True)

    class Meta:
        model = Asset
        fields = '__all__'

class BMSTelemetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = BMSTelemetry
        fields = '__all__'

class BMSDeviceSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    latest_telemetry = serializers.SerializerMethodField()

    class Meta:
        model = BMSDevice
        fields = '__all__'

    def get_latest_telemetry(self, obj):
        telemetry = obj.telemetry.first()
        if telemetry:
            return BMSTelemetrySerializer(telemetry).data
        return None

class PPMScheduleSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    
    class Meta:
        model = PPMSchedule
        fields = '__all__'

class TechnicianTrainingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    
    class Meta:
        model = TechnicianTraining
        fields = '__all__'

class SystemAuditSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    auditor_name = serializers.CharField(source='auditor.get_full_name', read_only=True)
    
    class Meta:
        model = SystemAudit
        fields = '__all__'

class CAFMAuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = CAFMAuditLog
        fields = '__all__'

class MaintenanceCommunicationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = MaintenanceCommunication
        fields = '__all__'
