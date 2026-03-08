from django.contrib import admin
from .models import Facility, Space, Asset, MaintenanceRequest

@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'contact_email', 'contact_phone', 'created_at')
    search_fields = ('name', 'address', 'contact_email')

@admin.register(Space)
class SpaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'facility', 'space_type', 'capacity', 'created_at')
    list_filter = ('facility', 'space_type')
    search_fields = ('name', 'facility__name', 'space_type')

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ('name', 'asset_type', 'status', 'facility', 'space', 'created_at')
    list_filter = ('status', 'asset_type', 'facility')
    search_fields = ('name', 'serial_number', 'asset_type')

@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'facility', 'priority', 'status', 'reported_by', 'assigned_to', 'created_at')
    list_filter = ('status', 'priority', 'facility')
    search_fields = ('title', 'description')
