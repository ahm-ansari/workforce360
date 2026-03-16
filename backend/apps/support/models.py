from django.db import models
from django.conf import settings

class TicketCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True) # Icon name for frontend

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Ticket Categories"

class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
        ('REOPENED', 'Reopened'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]

    ticket_id = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    category = models.ForeignKey(TicketCategory, on_delete=models.SET_NULL, null=True, related_name='tickets')
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # Department Integration
    department = models.ForeignKey('employees.Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets')
    
    # CAFM Integration
    facility = models.ForeignKey('cafm.Facility', on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets')
    space = models.ForeignKey('cafm.Space', on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets')
    asset = models.ForeignKey('cafm.Asset', on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    
    # KPIs and Time Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_at = models.DateTimeField(null=True, blank=True)
    first_response_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    sla_deadline = models.DateTimeField(null=True, blank=True)

    @property
    def response_time(self):
        if self.first_response_at:
            return self.first_response_at - self.created_at
        return None

    @property
    def resolution_time(self):
        if self.resolved_at:
            return self.resolved_at - self.created_at
        return None

    @property
    def time_to_assign(self):
        if self.assigned_at:
            return self.assigned_at - self.created_at
        return None

    @property
    def time_to_resolve_after_assignment(self):
        if self.resolved_at and self.assigned_at:
            return self.resolved_at - self.assigned_at
        return None

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            # Simple ID generation: SUP-YYYYMMDD-XXXX
            import datetime, random
            date_str = datetime.datetime.now().strftime('%Y%m%d')
            rand_suffix = ''.join(random.choices('0123456789', k=4))
            self.ticket_id = f"SUP-{date_str}-{rand_suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_id} - {self.title}"

    class Meta:
        ordering = ['-created_at']

class TicketMessage(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    attachment = models.FileField(upload_to='support/attachments/', null=True, blank=True)
    is_internal = models.BooleanField(default=False) # Internal notes for support staff
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.user.username} on {self.ticket.ticket_id}"

    class Meta:
        ordering = ['created_at']

class EscalationMatrix(models.Model):
    LEVEL_CHOICES = [
        (1, 'Level 1 - Support Executive'),
        (2, 'Level 2 - Team Lead / Supervisor'),
        (3, 'Level 3 - Manager / HOD'),
    ]
    department = models.ForeignKey('employees.Department', on_delete=models.CASCADE, related_name='escalations')
    level = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    
    def __str__(self):
        return f"{self.department.name} - Level {self.level} ({self.name})"

    class Meta:
        ordering = ['department', 'level']
        verbose_name_plural = "Escalation Matrices"
