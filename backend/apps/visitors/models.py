from django.db import models
from django.contrib.auth import get_user_model
from apps.employees.models import Employee

User = get_user_model()

class Visitor(models.Model):
    ID_PROOF_CHOICES = [
        ('PASSPORT', 'Passport'),
        ('DRIVERS_LICENSE', 'Driver\'s License'),
        ('NATIONAL_ID', 'National ID'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20)
    company = models.CharField(max_length=200, blank=True)
    purpose_of_visit = models.TextField()
    host_employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='hosted_visitors')
    check_in_time = models.DateTimeField(auto_now_add=True, null=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    id_proof_type = models.CharField(max_length=20, choices=ID_PROOF_CHOICES)
    id_proof_number = models.CharField(max_length=100, null=True, blank=True)
    photo = models.ImageField(upload_to='visitor_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ['-check_in_time']

    def __str__(self):
        return f"{self.name} - {self.company}"

    @property
    def is_checked_out(self):
        return self.check_out_time is not None

class GateEntry(models.Model):
    ENTRY_TYPE_CHOICES = [
        ('VISITOR', 'Visitor'),
        ('EMPLOYEE', 'Employee'),
        ('VENDOR', 'Vendor'),
    ]
    
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, null=True, blank=True, related_name='gate_entries')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True, related_name='gate_entries')
    entry_time = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    gate_number = models.CharField(max_length=10, default='1')
    entry_type = models.CharField(max_length=20, choices=ENTRY_TYPE_CHOICES, default='VISITOR')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ['-entry_time']
        verbose_name_plural = 'Gate Entries'

    def __str__(self):
        if self.visitor:
            return f"Gate {self.gate_number} - {self.visitor.name} ({self.entry_type})"
        elif self.employee:
            return f"Gate {self.gate_number} - {self.employee.first_name} ({self.entry_type})"
        return f"Gate {self.gate_number} - {self.entry_type}"

class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('CAR', 'Car'),
        ('MOTORCYCLE', 'Motorcycle'),
        ('TRUCK', 'Truck'),
        ('VAN', 'Van'),
        ('OTHER', 'Other'),
    ]
    
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, null=True, blank=True, related_name='vehicles')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True, related_name='vehicles')
    vehicle_number = models.CharField(max_length=20)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES)
    parking_slot = models.CharField(max_length=10, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.vehicle_number} ({self.vehicle_type})"

class Company(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    contact_person = models.CharField(max_length=200, blank=True)
    contact_person_designation = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Companies'

    def __str__(self):
        return self.name
