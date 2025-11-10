from django.contrib import admin
from .models import (
    RecruitmentPlan, JobOpening, Applicant,
    JobApplication, Screening, InterviewFeedback,
    EmployeeRecruited, Document
)
from django.contrib.contenttypes.admin import GenericTabularInline

class JobInline(admin.TabularInline):
    model = JobOpening
    extra = 0

@admin.register(RecruitmentPlan)
class RecruitmentPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'positions', 'status', 'created_at')
    search_fields = ('title', 'department')
    inlines = [JobInline]

@admin.register(JobOpening)
class JobOpeningAdmin(admin.ModelAdmin):
    list_display = ('job_code', 'title', 'plan', 'location', 'hiring_manager', 'created_at')
    search_fields = ('job_code', 'title', 'location')

@admin.register(Applicant)
class ApplicantAdmin(admin.ModelAdmin):
    list_display = ('cv', 'cover_letter', 'created_at')
    search_fields = ('cv', 'cover_letter')

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('applicant', 'job', 'status', 'applied_at', 'source')
    search_fields = ('applicant__first_name', 'applicant__email', 'job__title')
    list_filter = ('status', 'job')

@admin.register(Screening)
class ScreeningAdmin(admin.ModelAdmin):
    list_display = ('application', 'screener', 'score', 'passed', 'created_at')
    search_fields = ('application__applicant__email', 'screener__username')

@admin.register(InterviewFeedback)
class InterviewFeedbackAdmin(admin.ModelAdmin):
    list_display = ('application', 'interviewer', 'interview_type', 'score', 'decision_recommendation', 'created_at')
    search_fields = ('application__applicant__email', 'interviewer__username')

@admin.register(EmployeeRecruited)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('application', 'employee_code', 'person', 'position', 'start_date')
    search_fields = ('application', 'person__first_name', 'person__last_name')

class DocumentInline(GenericTabularInline):
    model = Document
    ct_field = "content_type"
    ct_fk_field = "object_id"
    extra = 0

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('doc_type', 'file', 'uploaded_by', 'uploaded_at')
    search_fields = ('doc_type',)
