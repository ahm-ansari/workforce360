from django.db import models
from django.conf import settings
from apps.employees.models import Employee

class Payroll(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PROCESSED', 'Processed'),
        ('PAID', 'Paid'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payrolls')
    month = models.PositiveSmallIntegerField()
    year = models.PositiveSmallIntegerField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_net(self):
        self.net_salary = self.basic_salary + self.allowances - self.deductions
        return self.net_salary

    def save(self, *args, **kwargs):
        if self.net_salary is None:
            self.calculate_net()
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('employee', 'month', 'year')
        ordering = ['-year', '-month']

    def __str__(self):
        return f"Payroll {self.employee} {self.month}/{self.year}" 

class Reimbursement(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('PAID', 'Paid'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='reimbursements')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    receipt_file = models.FileField(upload_to='reimbursements/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reimbursement {self.employee} {self.amount}" 

class Transaction(models.Model):
    TYPE_CHOICES = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.type} {self.amount} on {self.date}"
