from django.db import models
from person.models import Person
from django.utils import timezone


class Employee(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.OneToOneField(Person, on_delete=models.CASCADE)
    emp_code = models.CharField(max_length=10, unique=True)
    status = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    dataofjoining = models.DateField()
    dataofleaving = models.DateField(null=True, blank=True)
    reporting_manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    is_blocked  = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    performance_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    def __str__(self):
        return self.id
    
    @property
    def tenure_days(self):
        """Number of days the employee has been in the company."""
        end_date = self.date_of_leaving or timezone.now().date()
        if not self.date_of_joining:
            return 0
        return (end_date - self.date_of_joining).days
    
class EmployeeKPI(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='kpis')
    attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    task_completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    performance_index = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"KPI for {self.employee.emp_code}"

    def calculate_overall_score(self):
        """Simple weighted formula for demonstration."""
        return round(
            (float(self.attendance_rate) * 0.3) +
            (float(self.task_completion_rate) * 0.4) +
            (float(self.performance_index) * 0.3), 2
        )

    
class EmployeeDemoGraphics(models.Model):
    
    MARITAL_STATUS_CHOICES = [
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
    ]

    id = models.AutoField(primary_key=True)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)
    marital_status = models.CharField(max_length=10, choices=MARITAL_STATUS_CHOICES)
    nationality = models.CharField(max_length=100)
    religion = models.CharField(max_length=100, blank=True, null=True)
    ethnic_group = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"Demographics for {self.employee.person.first_name} {self.employee.person.last_name}"
    
class Employee_Payroll(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    bonus = models.DecimalField(max_digits=10, decimal_places=2)
    overtime = models.DecimalField(max_digits=10, decimal_places=2)
    esi = models.DecimalField(max_digits=10, decimal_places=2)
    pf = models.DecimalField(max_digits=10, decimal_places=2)
    loan = models.DecimalField(max_digits=10, decimal_places=2)
    insurance = models.DecimalField(max_digits=10, decimal_places=2)
    deduction = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Employee Payroll for {self.employee.person.first_name} {self.employee.person.last_name}"
    
class Employee_Attendance(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    in_time = models.TimeField()
    out_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Employee Attendence {self.employee.person.first_name} {self.employee.person.last_name} on {self.date}"

class Employee_Leave(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=100)
    approved_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Employee Leave {self.employee.person.first_name} {self.employee.person.last_name} - {self.leave_type}"
    

    