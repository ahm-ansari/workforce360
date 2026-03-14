from django.db import models
from django.contrib.auth import get_user_model
from apps.employees.models import Employee

User = get_user_model()

class Facility(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Space(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='spaces')
    name = models.CharField(max_length=255)
    space_type = models.CharField(max_length=100)
    capacity = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.facility.name}"

class Asset(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('MAINTENANCE', 'In Maintenance'),
        ('RETIRED', 'Retired')
    ]

    asset_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True)
    asset_type = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    installation_date = models.DateField(blank=True, null=True)
    purchase_date = models.DateField(blank=True, null=True)
    warranty_details = models.TextField(blank=True, null=True)
    warranty_expiry = models.DateField(blank=True, null=True)
    vendor_information = models.TextField(blank=True, null=True)
    maintenance_frequency = models.CharField(max_length=100, blank=True, null=True)
    asset_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    space = models.ForeignKey(Space, on_delete=models.SET_NULL, null=True, blank=True, related_name='assets')
    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True, blank=True, related_name='assets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.asset_id or self.category})"

class MaintenanceRequest(models.Model):
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
    ]

    work_order_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='maintenance_requests')
    space = models.ForeignKey(Space, on_delete=models.SET_NULL, null=True, blank=True, related_name='maintenance_requests')
    location_details = models.CharField(max_length=255, blank=True, null=True)
    asset = models.ForeignKey(Asset, on_delete=models.SET_NULL, null=True, blank=True, related_name='maintenance_requests')
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reported_issues')
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_maintenance')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    due_date = models.DateField(null=True, blank=True)
    estimated_completion_time = models.DateTimeField(null=True, blank=True)
    
    # SLA Monitoring
    sla_response_deadline = models.DateTimeField(null=True, blank=True)
    sla_resolution_deadline = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.facility.name}"

class MaintenanceLog(models.Model):
    request = models.ForeignKey(MaintenanceRequest, on_delete=models.CASCADE, related_name='logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status_change = models.CharField(max_length=50, blank=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log for {self.request.title} at {self.created_at}"

class BMSDevice(models.Model):
    DEVICE_TYPES = [
        ('HVAC', 'HVAC System'),
        ('LIGHTING', 'Lighting Control'),
        ('ENERGY', 'Energy Meter'),
        ('SECURITY', 'Security System'),
        ('FIRE', 'Fire Alarm'),
    ]
    
    name = models.CharField(max_length=255)
    device_type = models.CharField(max_length=50, choices=DEVICE_TYPES)
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE, related_name='bms_device', null=True, blank=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='bms_devices')
    external_id = models.CharField(max_length=100, unique=True, help_text="ID from the BMS system")
    is_active = models.BooleanField(default=True)
    last_communication = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.device_type}) - {self.facility.name}"

class BMSTelemetry(models.Model):
    device = models.ForeignKey(BMSDevice, on_delete=models.CASCADE, related_name='telemetry')
    reading_type = models.CharField(max_length=100, help_text="e.g., Temperature, Power, Status")
    value = models.FloatField()
    unit = models.CharField(max_length=50, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "BMS Telemetry"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.device.name} - {self.reading_type}: {self.value} {self.unit}"

class PPMSchedule(models.Model):
    FREQUENCY_CHOICES = [
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('YEARLY', 'Yearly'),
    ]
    
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='ppm_schedules')
    task_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    next_due_date = models.DateField()
    last_completed_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"PPM: {self.task_name} for {self.asset.name}"

class TechnicianTraining(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='training_records')
    course_name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255, blank=True)
    completion_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    certificate_number = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.employee.user.username} - {self.course_name}"

class SystemAudit(models.Model):
    AUDIT_TYPES = [
        ('ASSET', 'Asset Integrity'),
        ('SAFETY', 'Health & Safety'),
        ('ENERGY', 'Energy Audit'),
        ('BMS', 'BMS Calibration'),
    ]
    
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='audits')
    audit_type = models.CharField(max_length=20, choices=AUDIT_TYPES)
    auditor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    audit_date = models.DateField()
    score = models.IntegerField(help_text="Score out of 100")
    findings = models.TextField()
    recommendations = models.TextField(blank=True)

    def __str__(self):
        return f"{self.audit_type} Audit - {self.facility.name} ({self.audit_date})"

class CAFMAuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=100)
    resource_id = models.IntegerField(null=True, blank=True)
    details = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user} - {self.action} on {self.resource_type}"

class MaintenanceCommunication(models.Model):
    request = models.ForeignKey(MaintenanceRequest, on_delete=models.CASCADE, related_name='communications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Msg from {self.sender} on {self.request.title}"
