from rest_framework import serializers
from .models import Facility, Space, Asset, MaintenanceRequest

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'

class SpaceSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)

    class Meta:
        model = Space
        fields = '__all__'

class AssetSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    space_name = serializers.CharField(source='space.name', read_only=True)

    class Meta:
        model = Asset
        fields = '__all__'

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    space_name = serializers.CharField(source='space.name', read_only=True)
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.get_full_name', read_only=True, default='')
    assigned_to_name = serializers.CharField(source='assigned_to.user.get_full_name', read_only=True, default='')

    class Meta:
        model = MaintenanceRequest
        fields = '__all__'
