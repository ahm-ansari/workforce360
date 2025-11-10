from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JobApplication, Employee
from django.utils import timezone

@receiver(post_save, sender=JobApplication)
def create_employee_on_hired(sender, instance, created, **kwargs):
    """
    If a JobApplication becomes hired and there is no Employee for it,
    create an Employee record automatically.
    """
    if instance.status == 'hired':
        # if employee exists, do nothing
        if hasattr(instance, 'employee') and instance.employee is not None:
            return
        emp_code = f"EMP-{str(instance.id)[:8]}"
        Employee.objects.get_or_create(
            application=instance,
            defaults={
                'employee_code': emp_code,
                'first_name': instance.applicant.first_name,
                'last_name': instance.applicant.last_name,
                'email': instance.applicant.email,
                'start_date': None,  # set later by HR
            }
        )
