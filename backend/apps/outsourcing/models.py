from django.db import models
from django.contrib.auth import get_user_model
from apps.employees.models import Employee
from apps.visitors.models import Company

User = get_user_model()

class StaffingRequest(models.Model):
    """Client requests for manpower/staffing solutions"""
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('PARTIALLY_FILLED', 'Partially Filled'),
        ('FILLED', 'Filled'),
        ('CANCELLED', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]

    client = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='staffing_requests')
    title = models.CharField(max_length=200)
    description = models.TextField()
    required_skills = models.TextField(help_text="Comma-separated list of skills required")
    experience_years = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    number_of_positions = models.PositiveIntegerField(default=1)
    proposed_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Proposed billing rate per hour")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_staffing_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.client.name}"

class OutsourcedStaff(models.Model):
    """Tracking employees assigned to clients as part of outsourcing services"""
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('ON_LEAVE', 'On Leave'),
        ('COMPLETED', 'Completed'),
        ('TERMINATED', 'Terminated'),
    ]

    staffing_request = models.ForeignKey(StaffingRequest, on_delete=models.SET_NULL, null=True, blank=True, related_name='placements')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='outsourced_placements')
    client = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='outsourced_staff')
    
    role = models.CharField(max_length=200)
    billing_rate = models.DecimalField(max_digits=10, decimal_places=2, help_text="Agreed billing rate per hour")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Outsourced Staff"
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.employee} @ {self.client.name}"

class StaffingContract(models.Model):
    """Contracts defining the terms of outsourcing services for a client"""
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('TERMINATED', 'Terminated'),
        ('DRAFT', 'Draft'),
    ]

    client = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='staffing_contracts')
    contract_number = models.CharField(max_length=50, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    terms_and_conditions = models.TextField()
    contract_file = models.FileField(upload_to='contracts/staffing/', null=True, blank=True)
    total_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Contract {self.contract_number} - {self.client.name}"

class StaffingTimesheet(models.Model):
    """Timesheets for outsourced staff to track billable hours"""
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('INVOICED', 'Invoiced'),
    ]

    placement = models.ForeignKey(OutsourcedStaff, on_delete=models.CASCADE, related_name='timesheets')
    start_date = models.DateField()
    end_date = models.DateField()
    total_hours = models.DecimalField(max_digits=6, decimal_places=2)
    billable_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_timesheets')
    approval_date = models.DateTimeField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Timesheet {self.placement.employee} ({self.start_date} - {self.end_date})"
