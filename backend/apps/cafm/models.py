from django.db import models
from django.contrib.auth import get_user_model
from apps.employees.models import Employee

User = get_user_model()

class Vendor(models.Model):
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    service_type = models.CharField(max_length=100, help_text="e.g., HVAC, Electrical, Plumbing")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class SLAPolicy(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    response_time_hours = models.IntegerField(help_text="Target response time in hours")
    resolution_time_hours = models.IntegerField(help_text="Target resolution time in hours")
    priority_level = models.CharField(max_length=20, choices=[
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ])

    def __str__(self):
        return f"{self.name} ({self.priority_level})"

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
        ('RETIRED', 'Retired'),
        ('DISPOSED', 'Disposed')
    ]

    asset_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True)
    asset_type = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    
    # Lifecycle Management
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='assets')
    purchase_date = models.DateField(blank=True, null=True)
    installation_date = models.DateField(blank=True, null=True)
    purchase_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    expected_life_years = models.IntegerField(default=5)
    salvage_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    warranty_details = models.TextField(blank=True, null=True)
    warranty_expiry = models.DateField(blank=True, null=True)
    
    maintenance_frequency = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    space = models.ForeignKey(Space, on_delete=models.SET_NULL, null=True, blank=True, related_name='assets')
    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True, blank=True, related_name='assets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.asset_id or self.category})"

    @property
    def age(self):
        from datetime import date
        if self.installation_date:
            return (date.today() - self.installation_date).days // 365
        return 0

class MaintenanceRequest(models.Model):
    TYPE_CHOICES = [
        ('REACTIVE', 'Reactive Maintenance'),
        ('PPM', 'Planned Preventive Maintenance'),
        ('EMERGENCY', 'Emergency'),
        ('INSPECTION', 'Inspection'),
    ]
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('ON_HOLD', 'On Hold'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
    ]

    work_order_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    request_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='REACTIVE')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='maintenance_requests')
    space = models.ForeignKey(Space, on_delete=models.SET_NULL, null=True, blank=True, related_name='maintenance_requests')
    asset = models.ForeignKey(Asset, on_delete=models.SET_NULL, null=True, blank=True, related_name='maintenance_requests')
    
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reported_issues')
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_maintenance')
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='maintenance_work')
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    
    # SLA & KPI Tracking
    sla_policy = models.ForeignKey(SLAPolicy, on_delete=models.SET_NULL, null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    sla_response_deadline = models.DateTimeField(null=True, blank=True)
    sla_resolution_deadline = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.work_order_id or self.title} - {self.status}"

class WorkOrderStep(models.Model):
    request = models.ForeignKey(MaintenanceRequest, on_delete=models.CASCADE, related_name='steps')
    description = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Step {self.order} for {self.request.work_order_id}"

class InventoryItem(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    sku = models.CharField(max_length=100, unique=True)
    quantity = models.IntegerField(default=0)
    min_quantity = models.IntegerField(default=5)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100, blank=True)
    asset = models.ForeignKey(Asset, on_delete=models.SET_NULL, null=True, blank=True, related_name='spare_parts')

    def __str__(self):
        return f"{self.name} ({self.quantity} in stock)"

class MaintenanceLog(models.Model):
    request = models.ForeignKey(MaintenanceRequest, on_delete=models.CASCADE, related_name='logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status_change = models.CharField(max_length=50, blank=True)
    comment = models.TextField()
    attachments = models.FileField(upload_to='maintenance_logs/', null=True, blank=True)
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
        ('WATER', 'Water Management'),
    ]
    
    name = models.CharField(max_length=255)
    device_type = models.CharField(max_length=50, choices=DEVICE_TYPES)
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE, related_name='bms_device', null=True, blank=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='bms_devices')
    external_id = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    last_communication = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.device_type})"

class BMSTelemetry(models.Model):
    device = models.ForeignKey(BMSDevice, on_delete=models.CASCADE, related_name='telemetry')
    reading_type = models.CharField(max_length=100)
    value = models.FloatField()
    unit = models.CharField(max_length=50, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "BMS Telemetry"
        ordering = ['-timestamp']

class PPMSchedule(models.Model):
    FREQUENCY_CHOICES = [
        ('DAILY', 'Daily'),
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
    sla_policy = models.ForeignKey(SLAPolicy, on_delete=models.SET_NULL, null=True, blank=True)
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
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
        return f"{self.employee} - {self.course_name}"

class SystemAudit(models.Model):
    AUDIT_TYPES = [
        ('ASSET', 'Asset Integrity'),
        ('SAFETY', 'Health & Safety'),
        ('ENERGY', 'Energy Audit'),
        ('BMS', 'BMS Calibration'),
        ('COMPLIANCE', 'Regulatory Compliance'),
    ]
    
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='audits')
    audit_type = models.CharField(max_length=20, choices=AUDIT_TYPES)
    auditor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    audit_date = models.DateField()
    score = models.IntegerField()
    findings = models.TextField()
    recommendations = models.TextField(blank=True)

    def __str__(self):
        return f"{self.audit_type} Audit - {self.facility.name}"

class MaintenanceCommunication(models.Model):
    request = models.ForeignKey(MaintenanceRequest, on_delete=models.CASCADE, related_name='communications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

class CAFMAuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=100)
    resource_id = models.IntegerField(null=True, blank=True)
    details = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
