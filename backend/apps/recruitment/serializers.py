from rest_framework import serializers
from .models import Job, Candidate, Interview, HiringStage, CandidateStageHistory, JobCategory
from apps.employees.models import Department

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = '__all__'

class HiringStageSerializer(serializers.ModelSerializer):
    candidate_count = serializers.SerializerMethodField()
    
    class Meta:
        model = HiringStage
        fields = '__all__'
    
    def get_candidate_count(self, obj):
        return obj.candidates.count()

class JobSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    category_name = serializers.CharField(source='job_category.name', read_only=True)
    posted_by_name = serializers.CharField(source='posted_by.get_full_name', read_only=True)
    candidate_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['posted_by', 'posted_date', 'created_at', 'updated_at']
    
    def get_candidate_count(self, obj):
        return obj.candidates.count()

class CandidateSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    current_stage_name = serializers.CharField(source='current_stage.name', read_only=True)
    interview_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidate
        fields = '__all__'
        read_only_fields = ['applied_date', 'created_at', 'updated_at']
    
    def get_interview_count(self, obj):
        return obj.interviews.count()

class CandidateStageHistorySerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    moved_by_name = serializers.CharField(source='moved_by.get_full_name', read_only=True)
    
    class Meta:
        model = CandidateStageHistory
        fields = '__all__'
        read_only_fields = ['moved_at']

class InterviewSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    interviewer_name = serializers.CharField(source='interviewer.get_full_name', read_only=True)
    job_title = serializers.CharField(source='candidate.job.title', read_only=True)
    
    class Meta:
        model = Interview
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class PublicJobSerializer(serializers.ModelSerializer):
    """Serializer for public job listings (limited fields)"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    category_name = serializers.CharField(source='job_category.name', read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'requirements', 'responsibilities',
            'department_name', 'category_name', 'employment_type', 'experience_level',
            'salary_range_min', 'salary_range_max', 'location', 'remote_option',
            'posted_date', 'closing_date', 'number_of_positions', 'skills_required'
        ]

class CandidateApplicationSerializer(serializers.ModelSerializer):
    """Serializer for public job applications"""
    class Meta:
        model = Candidate
        fields = [
            'name', 'email', 'phone', 'resume_file', 'cover_letter',
            'linkedin_url', 'portfolio_url', 'job', 'source'
        ]
