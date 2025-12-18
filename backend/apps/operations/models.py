from django.db import models
from apps.employees.models import Employee
from apps.clients.models import Client, ClientSite
from apps.sales.models import WorkOrder

class Deployment(models.Model):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('ACTIVE', 'Active'),
        ('ON_LEAVE', 'On Leave'),
        ('RECALLED', 'Recalled'),
        ('COMPLETED', 'Completed'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='deployments')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='deployments')
    site = models.ForeignKey(ClientSite, on_delete=models.SET_NULL, null=True, blank=True, related_name='deployments')
    work_order = models.ForeignKey(WorkOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name='deployments')
    
    role_at_deployment = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    deployment_letter = models.FileField(upload_to='deployments/letters/', null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee} deployed to {self.client.name}"

    class Meta:
        ordering = ['-start_date']
