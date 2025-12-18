from django.db import models
from django.contrib.auth import get_user_model
from apps.employees.models import Employee
from apps.visitors.models import Company

User = get_user_model()


class Service(models.Model):
    """Services offered by the company"""
    PRICING_TYPE_CHOICES = [
        ('HOURLY', 'Hourly Rate'),
        ('FIXED', 'Fixed Price'),
        ('SUBSCRIPTION', 'Subscription'),
        ('CUSTOM', 'Custom Pricing'),
    ]
    
    CATEGORY_CHOICES = [
        ('IT', 'Information Technology'),
        ('CONSULTING', 'Consulting'),
        ('DESIGN', 'Design'),
        ('MARKETING', 'Marketing'),
        ('DEVELOPMENT', 'Development'),
        ('SUPPORT', 'Support & Maintenance'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    pricing_type = models.CharField(max_length=20, choices=PRICING_TYPE_CHOICES)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    companies = models.ManyToManyField(Company, related_name='services', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Solution(models.Model):
    """Solutions provided by the company"""
    CATEGORY_CHOICES = [
        ('SOFTWARE', 'Software Solution'),
        ('HARDWARE', 'Hardware Solution'),
        ('CLOUD', 'Cloud Solution'),
        ('MOBILE', 'Mobile Solution'),
        ('WEB', 'Web Solution'),
        ('ENTERPRISE', 'Enterprise Solution'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    technology_stack = models.TextField(blank=True, help_text="Technologies used (comma-separated)")
    features = models.TextField(blank=True, help_text="Key features (one per line)")
    target_industry = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    companies = models.ManyToManyField(Company, related_name='solutions', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Project(models.Model):
    """Client projects"""
    STATUS_CHOICES = [
        ('PLANNING', 'Planning'),
        ('IN_PROGRESS', 'In Progress'),
        ('ON_HOLD', 'On Hold'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='projects')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    solution = models.ForeignKey(Solution, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNING')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    actual_end_date = models.DateField(null=True, blank=True)
    
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    actual_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, default=0)
    
    project_manager = models.ForeignKey(
        Employee, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='managed_projects'
    )
    team_members = models.ManyToManyField(Employee, related_name='projects', blank=True)
    
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"
    
    @property
    def is_overbudget(self):
        """Check if project is over budget"""
        if self.budget and self.actual_cost:
            return self.actual_cost > self.budget
        return False
    
    @property
    def budget_utilization(self):
        """Calculate budget utilization percentage"""
        if self.budget and self.actual_cost:
            return (self.actual_cost / self.budget) * 100
        return 0


class ProjectMilestone(models.Model):
    """Project milestones for tracking progress"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('DELAYED', 'Delayed'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    completion_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    deliverables = models.TextField(blank=True, help_text="Expected deliverables (one per line)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['due_date']
    
    def __str__(self):
        return f"{self.project.name} - {self.title}"
    
    @property
    def is_overdue(self):
        """Check if milestone is overdue"""
        from django.utils import timezone
        if self.status != 'COMPLETED' and self.due_date:
            return timezone.now().date() > self.due_date
        return False


class ProjectDocument(models.Model):
    """Documents related to projects"""
    DOCUMENT_TYPE_CHOICES = [
        ('PROPOSAL', 'Proposal'),
        ('CONTRACT', 'Contract'),
        ('REQUIREMENT', 'Requirement Document'),
        ('DESIGN', 'Design Document'),
        ('REPORT', 'Report'),
        ('OTHER', 'Other'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES, default='OTHER')
    document_file = models.FileField(upload_to='project_documents/')
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.project.name} - {self.title}"
