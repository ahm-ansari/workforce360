from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class MarketingAnalysis(models.Model):
    """Marketing analysis including SWOT and market trends"""
    title = models.CharField(max_length=200)
    strengths = models.TextField(blank=True, help_text="SWOT: Strengths")
    weaknesses = models.TextField(blank=True, help_text="SWOT: Weaknesses")
    opportunities = models.TextField(blank=True, help_text="SWOT: Opportunities")
    threats = models.TextField(blank=True, help_text="SWOT: Threats")
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
    key_channels = models.TextField(help_text="Primary marketing channels (e.g. SEO, Content, Social)")
    objectives = models.TextField(help_text="Strategic objectives and goals")
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
    plan = models.ForeignKey(MarketingPlan, on_delete=models.CASCADE, related_name='campaigns')
    name = models.CharField(max_length=200)
    platform = models.CharField(max_length=100)
    budget_allocated = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    kpis = models.TextField(blank=True, help_text="Key Performance Indicators")
    metrics_achieved = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
