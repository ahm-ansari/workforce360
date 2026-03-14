import os
import django
import dotenv
from datetime import date, timedelta, datetime

dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.cafm.models import Facility, Asset, PPMSchedule, SystemAudit, TechnicianTraining
from apps.employees.models import Employee
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_advanced_cafm():
    hq = Facility.objects.filter(name='Global Headquarters').first()
    hvac = Asset.objects.filter(name='Primary HVAC Unit - Roof').first()
    admin = User.objects.filter(username='admin').first()
    tech = Employee.objects.first()

    if not all([hq, hvac, admin, tech]):
        print("Required base data missing, seeding aborted")
        return

    # 1. PPM Schedules
    PPMSchedule.objects.get_or_create(
        asset=hvac,
        task_name='Quarterly Filter Replacement',
        defaults={
            'description': 'Replace all air filters in the main HVAC unit.',
            'frequency': 'QUARTERLY',
            'next_due_date': date.today() + timedelta(days=90),
            'is_active': True
        }
    )
    
    PPMSchedule.objects.get_or_create(
        asset=hvac,
        task_name='Monthly Belt Inspection',
        defaults={
            'description': 'Check motor belts for wear and tension.',
            'frequency': 'MONTHLY',
            'next_due_date': date.today() + timedelta(days=30),
            'is_active': True
        }
    )

    # 2. Technician Training
    TechnicianTraining.objects.get_or_create(
        employee=tech,
        course_name='Advanced HVAC Systems',
        defaults={
            'provider': 'Industrial Cooling Academy',
            'completion_date': date.today() - timedelta(days=120),
            'expiry_date': date.today() + timedelta(days=245),
            'certificate_number': 'HVAC-CERT-5501'
        }
    )

    # 3. System Audits
    SystemAudit.objects.get_or_create(
        facility=hq,
        audit_type='SAFETY',
        audit_date=date.today() - timedelta(days=15),
        defaults={
            'auditor': admin,
            'score': 92,
            'findings': 'Exit signs functional. Fire extinguishers up to date. Small obstruction in stairwell B.',
            'recommendations': 'Clear stairwell B by end of week.'
        }
    )

    print('Advanced CAFM operational data seeded successfully')

if __name__ == '__main__':
    seed_advanced_cafm()
