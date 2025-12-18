from django.contrib import admin
from .models import Service, Solution, Project, ProjectMilestone, ProjectDocument


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'pricing_type', 'base_price', 'is_active', 'created_at']
    list_filter = ['category', 'pricing_type', 'is_active']
    search_fields = ['name', 'description']
    filter_horizontal = ['companies']
    ordering = ['name']


@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'target_industry', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description', 'technology_stack']
    filter_horizontal = ['companies']
    ordering = ['name']


class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 1
    fields = ['title', 'due_date', 'status', 'completion_date']


class ProjectDocumentInline(admin.TabularInline):
    model = ProjectDocument
    extra = 0
    fields = ['title', 'document_type', 'document_file', 'uploaded_by']
    readonly_fields = ['uploaded_by']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'company', 'status', 'priority', 'project_manager', 
        'start_date', 'end_date', 'budget', 'actual_cost', 'created_at'
    ]
    list_filter = ['status', 'priority', 'start_date', 'end_date']
    search_fields = ['name', 'description', 'company__name']
    filter_horizontal = ['team_members']
    readonly_fields = ['created_by', 'created_at', 'updated_at', 'is_overbudget', 'budget_utilization']
    inlines = [ProjectMilestoneInline, ProjectDocumentInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'company', 'service', 'solution')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'actual_end_date')
        }),
        ('Budget', {
            'fields': ('budget', 'actual_cost', 'is_overbudget', 'budget_utilization')
        }),
        ('Team', {
            'fields': ('project_manager', 'team_members')
        }),
        ('Additional Information', {
            'fields': ('notes', 'created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'due_date', 'status', 'completion_date', 'is_overdue']
    list_filter = ['status', 'due_date', 'project']
    search_fields = ['title', 'description', 'project__name']
    ordering = ['due_date']
    readonly_fields = ['is_overdue']


@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'document_type', 'uploaded_by', 'created_at']
    list_filter = ['document_type', 'created_at']
    search_fields = ['title', 'description', 'project__name']
    readonly_fields = ['uploaded_by', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)
