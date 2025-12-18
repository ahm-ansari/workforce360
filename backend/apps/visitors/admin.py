from django.contrib import admin
from .models import Visitor, GateEntry, Vehicle, Company


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'host_employee', 'check_in_time', 'is_checked_out')
    list_filter = ('check_in_time', 'check_out_time', 'id_proof_type')
    search_fields = ('name', 'email', 'phone', 'company', 'id_proof_number')
    readonly_fields = ('check_in_time', 'created_at', 'updated_at')
    date_hierarchy = 'check_in_time'
    
    fieldsets = (
        ('Visitor Information', {
            'fields': ('name', 'email', 'phone', 'company', 'photo')
        }),
        ('Visit Details', {
            'fields': ('purpose_of_visit', 'host_employee')
        }),
        ('Identification', {
            'fields': ('id_proof_type', 'id_proof_number')
        }),
        ('Check-in/out', {
            'fields': ('check_in_time', 'check_out_time')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(GateEntry)
class GateEntryAdmin(admin.ModelAdmin):
    list_display = ('gate_number', 'entry_type', 'get_person_name', 'entry_time', 'exit_time')
    list_filter = ('entry_type', 'gate_number', 'entry_time')
    search_fields = ('visitor__name', 'employee__user__first_name', 'employee__user__last_name')
    readonly_fields = ('entry_time', 'created_at', 'updated_at')
    date_hierarchy = 'entry_time'
    
    def get_person_name(self, obj):
        if obj.visitor:
            return obj.visitor.name
        elif obj.employee:
            return obj.employee.user.get_full_name() or obj.employee.user.username
        return '-'
    get_person_name.short_description = 'Person'


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_number', 'vehicle_type', 'get_owner_name', 'parking_slot')
    list_filter = ('vehicle_type',)
    search_fields = ('vehicle_number', 'parking_slot', 'visitor__name', 'employee__user__first_name')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_owner_name(self, obj):
        if obj.visitor:
            return f"Visitor: {obj.visitor.name}"
        elif obj.employee:
            return f"Employee: {obj.employee.user.get_full_name() or obj.employee.user.username}"
        return '-'
    get_owner_name.short_description = 'Owner'


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'industry', 'contact_person', 'phone', 'is_active')
    list_filter = ('is_active', 'industry')
    search_fields = ('name', 'email', 'phone', 'contact_person', 'industry')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Company Information', {
            'fields': ('name', 'industry', 'website', 'logo', 'is_active')
        }),
        ('Contact Details', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Contact Person', {
            'fields': ('contact_person', 'contact_person_designation')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
