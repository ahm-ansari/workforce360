from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

class MarketingAnalysis(models.Model):
    """Marketing analysis including SWOT and market trends"""
    title = models.CharField(max_length=200)
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    opportunities = models.TextField(blank=True)
    threats = models.TextField(blank=True)
    market_trends = models.TextField(blank=True)
    competitor_analysis = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='marketing_analyses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Marketing Analyses"
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class MarketingStrategy(models.Model):
    """High level marketing strategy based on analysis"""
    analysis = models.ForeignKey(MarketingAnalysis, on_delete=models.CASCADE, related_name='strategies')
    title = models.CharField(max_length=200)
    target_audience = models.TextField()
    value_proposition = models.TextField()
    key_channels = models.TextField()
    objectives = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Marketing Strategies"
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class MarketingPlan(models.Model):
    """Execution plan for a marketing strategy"""
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('APPROVED', 'Approved'),
        ('EXECUTING', 'Executing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    strategy = models.ForeignKey(MarketingStrategy, on_delete=models.CASCADE, related_name='plans')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.title


class MarketingCampaign(models.Model):
    """Individual campaigns within a marketing plan"""
    PLATFORM_CHOICES = [
        ('Instagram', 'Instagram'),
        ('Facebook', 'Facebook'),
        ('LinkedIn', 'LinkedIn'),
        ('Twitter / X', 'Twitter / X'),
        ('Google Ads', 'Google Ads'),
        ('Email', 'Email Marketing'),
        ('YouTube', 'YouTube'),
        ('WhatsApp', 'WhatsApp'),
        ('Content / Blog', 'Content / Blog'),
        ('Events', 'Events & Webinars'),
        ('Other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('PLANNED', 'Planned'),
        ('ACTIVE', 'Active'),
        ('PAUSED', 'Paused'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    plan = models.ForeignKey(MarketingPlan, on_delete=models.CASCADE, related_name='campaigns')
    name = models.CharField(max_length=200)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES, default='Other')
    budget_allocated = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0'))
    budget_spent = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0'))
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNED')
    kpis = models.TextField(blank=True)
    # Metrics
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def ctr(self):
        """Click-through rate"""
        if self.impressions > 0:
            return round((self.clicks / self.impressions) * 100, 2)
        return 0

    @property
    def cpc(self):
        """Cost per click"""
        if self.clicks > 0:
            return round(float(self.budget_spent) / self.clicks, 2)
        return 0

    @property
    def roi(self):
        """Return on investment"""
        if self.budget_spent > 0:
            return round(((float(self.revenue_generated) - float(self.budget_spent)) / float(self.budget_spent)) * 100, 1)
        return 0

    def __str__(self):
        return self.name


class MarketingLead(models.Model):
    """Leads generated from marketing campaigns"""
    SOURCE_CHOICES = [
        ('Website', 'Website'),
        ('Social Media', 'Social Media'),
        ('Email', 'Email Campaign'),
        ('Referral', 'Referral'),
        ('Event', 'Event / Webinar'),
        ('Cold Outreach', 'Cold Outreach'),
        ('Other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('CONTACTED', 'Contacted'),
        ('QUALIFIED', 'Qualified'),
        ('PROPOSAL', 'Proposal Sent'),
        ('NEGOTIATION', 'Negotiation'),
        ('WON', 'Won'),
        ('LOST', 'Lost'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='Website')
    campaign = models.ForeignKey(MarketingCampaign, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    estimated_value = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_leads')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.status})"
