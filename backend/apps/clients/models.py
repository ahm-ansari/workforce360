from django.db import models
from apps.employees.models import Employee

class Client(models.Model):
    CLIENT_TYPE_CHOICES = [
        ('ENTERPRISE', 'Enterprise'),
        ('SME', 'Small/Medium Enterprise'),
        ('GOVERNMENT', 'Government Entity'),
        ('NGO', 'Non-Governmental Organization'),
        ('INDIVIDUAL', 'Individual'),
    ]

    STATUS_CHOICES = [
        ('PROSPECT', 'Prospect'),
        ('NEGOTIATION', 'Negotiation'),
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('ON_HOLD', 'On Hold'),
    ]

    name = models.CharField(max_length=255, unique=True)
    legal_name = models.CharField(max_length=255, blank=True)
    client_type = models.CharField(max_length=20, choices=CLIENT_TYPE_CHOICES, default='ENTERPRISE')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Contact Info
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    
    # Business Info
    industry = models.CharField(max_length=100, blank=True)
    tax_id = models.CharField(max_length=50, blank=True, verbose_name="Tax ID / PAN")
    vat_id = models.CharField(max_length=50, blank=True, verbose_name="VAT / GST Registration")
    
    # Relationship Info
    account_manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_clients')
    joined_date = models.DateField(null=True, blank=True)
    
    # Billing Info
    payment_terms = models.CharField(max_length=100, blank=True, help_text="e.g. Net 30, Due on Receipt")
    currency = models.CharField(max_length=10, default='USD')
    
    logo = models.ImageField(upload_to='client_logos/', blank=True, null=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class ClientContact(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contacts')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    designation = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    is_primary = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.client.name})"

class ClientSite(models.Model):
    SITE_TYPE_CHOICES = [
        ('HEADQUARTERS', 'Headquarters'),
        ('BRANCH', 'Branch Office'),
        ('WAREHOUSE', 'Warehouse'),
        ('ONSITE_CLIENT', 'Client On-site Location'),
        ('OTHER', 'Other'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='sites')
    site_name = models.CharField(max_length=200)
    site_type = models.CharField(max_length=20, choices=SITE_TYPE_CHOICES, default='BRANCH')
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='India')
    zip_code = models.CharField(max_length=20, blank=True)
    
    is_billing_address = models.BooleanField(default=False)
    is_shipping_address = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.site_name} - {self.client.name}"
