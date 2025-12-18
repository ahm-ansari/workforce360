from django.db import models
from django.contrib.auth import get_user_model
from apps.employees.models import Department

User = get_user_model()

class JobCategory(models.Model):
    """Categories for job postings (Engineering, Sales, Marketing, etc.)"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Job Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class HiringStage(models.Model):
    """Stages in the hiring pipeline"""
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.order}. {self.name}"

class Job(models.Model):
    """Job posting model with enhanced fields"""
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('CLOSED', 'Closed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    EMPLOYMENT_TYPE_CHOICES = [
        ('FULL_TIME', 'Full-time'),
        ('PART_TIME', 'Part-time'),
        ('CONTRACT', 'Contract'),
        ('INTERNSHIP', 'Internship'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('ENTRY', 'Entry Level'),
        ('MID', 'Mid Level'),
        ('SENIOR', 'Senior Level'),
        ('EXECUTIVE', 'Executive'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField(default='', blank=True)
    responsibilities = models.TextField(default='', blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='jobs')
    job_category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True, related_name='jobs')
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='FULL_TIME')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='MID')
    salary_range_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_range_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=200, default='Office', blank=True)
    remote_option = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='posted_jobs')
    posted_date = models.DateField(null=True, blank=True)
    closing_date = models.DateField(null=True, blank=True)
    number_of_positions = models.IntegerField(default=1)
    skills_required = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-posted_date', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.status}"

class Candidate(models.Model):
    """Enhanced candidate model with application tracking"""
    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('SCREENING', 'Screening'),
        ('INTERVIEW', 'Interview'),
        ('OFFERED', 'Offered'),
        ('HIRED', 'Hired'),
        ('REJECTED', 'Rejected'),
    ]
    
    SOURCE_CHOICES = [
        ('WEBSITE', 'Website'),
        ('REFERRAL', 'Referral'),
        ('LINKEDIN', 'LinkedIn'),
        ('INDEED', 'Indeed'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    resume_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    cover_letter = models.TextField(blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='candidates')
    current_stage = models.ForeignKey(HiringStage, on_delete=models.SET_NULL, null=True, related_name='candidates')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPLIED')
    applied_date = models.DateField(auto_now_add=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='WEBSITE')
    rating = models.IntegerField(null=True, blank=True, choices=[(i, i) for i in range(1, 6)])
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_date']

    def __str__(self):
        return f"{self.name} - {self.job.title}"

class CandidateStageHistory(models.Model):
    """Track candidate movement through hiring stages"""
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='stage_history')
    stage = models.ForeignKey(HiringStage, on_delete=models.CASCADE)
    moved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    moved_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-moved_at']
        verbose_name_plural = 'Candidate Stage Histories'
    
    def __str__(self):
        return f"{self.candidate.name} → {self.stage.name}"

class Interview(models.Model):
    """Enhanced interview scheduling model"""
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('RESCHEDULED', 'Rescheduled'),
    ]
    
    TYPE_CHOICES = [
        ('PHONE', 'Phone'),
        ('VIDEO', 'Video'),
        ('IN_PERSON', 'In-person'),
        ('TECHNICAL', 'Technical'),
        ('HR', 'HR Round'),
    ]
    
    RECOMMENDATION_CHOICES = [
        ('STRONG_HIRE', 'Strong Hire'),
        ('HIRE', 'Hire'),
        ('MAYBE', 'Maybe'),
        ('NO_HIRE', 'No Hire'),
    ]
    
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='interviews')
    interviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='interviews')
    interview_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='VIDEO')
    scheduled_date = models.DateField(null=True, blank=True)
    scheduled_time = models.TimeField(null=True, blank=True)
    duration = models.IntegerField(default=60, help_text='Duration in minutes')
    location = models.CharField(max_length=200, blank=True, help_text='Location or meeting link')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    feedback = models.TextField(blank=True)
    rating = models.IntegerField(null=True, blank=True, choices=[(i, i) for i in range(1, 6)])
    recommendation = models.CharField(max_length=20, choices=RECOMMENDATION_CHOICES, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_date', '-scheduled_time']

    def __str__(self):
        return f"Interview for {self.candidate.name} on {self.scheduled_date}"
