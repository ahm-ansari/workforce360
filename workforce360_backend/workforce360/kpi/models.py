# kpi/models.py
from django.db import models
from django.utils import timezone

class KPIRecord(models.Model):
    employee = models.ForeignKey("core.Employee", on_delete=models.CASCADE)
    metric_name = models.CharField(max_length=100)
    metric_value = models.FloatField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "KPI Record"
        verbose_name_plural = "KPI Records"
