import os
import django
from datetime import date, timedelta
import random

import pymysql
pymysql.install_as_MySQLdb()

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.employees.models import Employee, Department, Designation
from apps.cafm.models import Facility, Space, Asset, MaintenanceRequest

User = get_user_model()

print("Seeding CAFM Data...")

# 1. Setup default user/employee
admin_user, _ = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com', 'is_superuser': True, 'is_staff': True})
if _: 
    admin_user.set_password('admin123')
    admin_user.save()

# Let's create a facilities department and designation if they don't exist
dept, _ = Department.objects.get_or_create(name='Facilities Management')
desig, _ = Designation.objects.get_or_create(name='Maintenance Technician', department=dept)

employee_user, _ = User.objects.get_or_create(username='maintenance_tech', defaults={'email': 'tech@example.com'})
if _: 
    employee_user.set_password('tech123')
    employee_user.save()

employee, _ = Employee.objects.get_or_create(
    user=employee_user,
    defaults={
        'department': dept,
        'designation': desig,
        'date_of_joining': date(2022, 1, 15)
    }
)

# Clear existing CAFM data
MaintenanceRequest.objects.all().delete()
Asset.objects.all().delete()
Space.objects.all().delete()
Facility.objects.all().delete()

# 2. Create Facilities
f1 = Facility.objects.create(name='Global Headquarters', address='123 Corporate Blvd, Tech City, CA 90210', contact_email='hq@workforce360.com', contact_phone='1-800-555-0101')
f2 = Facility.objects.create(name='Westside Regional Office', address='456 West Ave, Commerce Park, NY 10001', contact_email='westside@workforce360.com', contact_phone='1-800-555-0102')
f3 = Facility.objects.create(name='Downtown Hub', address='789 Main St, Metro Center, TX 75001', contact_email='downtown@workforce360.com', contact_phone='1-800-555-0103')

# 3. Create Spaces
s1_f1 = Space.objects.create(facility=f1, name='Main Lobby', space_type='Common Area', capacity=150)
s2_f1 = Space.objects.create(facility=f1, name='Server Room A', space_type='Data Center', capacity=5)
s3_f1 = Space.objects.create(facility=f1, name='Executive Boardroom', space_type='Meeting Room', capacity=20)
s4_f1 = Space.objects.create(facility=f1, name='Floor 3 Open Layout', space_type='Workspace', capacity=120)

s1_f2 = Space.objects.create(facility=f2, name='Open Plan Area', space_type='Workspace', capacity=50)
s2_f2 = Space.objects.create(facility=f2, name='Cafeteria', space_type='Dining', capacity=60)

s1_f3 = Space.objects.create(facility=f3, name='Co-working Space', space_type='Workspace', capacity=100)

# 4. Create Assets
a1 = Asset.objects.create(name='Primary HVAC Unit - Roof', description='Main building cooling unig', asset_type='HVAC', status='ACTIVE', facility=f1, serial_number='HVAC-990-2XZ', purchase_date=date(2020, 5, 12))
a2 = Asset.objects.create(name='Server Rack 1', description='Main server rack for core networking', asset_type='IT Equipment', status='ACTIVE', facility=f1, space=s2_f1, serial_number='SR1-0001', purchase_date=date(2021, 2, 1))
a3 = Asset.objects.create(name='Industrial Espresso Machine', description='Cafeteria coffee maker', asset_type='Kitchen Equipment', status='MAINTENANCE', facility=f2, space=s2_f2, serial_number='EM-99X')
a4 = Asset.objects.create(name='Lobby Display Screen 85"', description='Welcome sign TV', asset_type='AV Equipment', status='ACTIVE', facility=f1, space=s1_f1)
a5 = Asset.objects.create(name='Executive Projector', asset_type='AV Equipment', status='ACTIVE', facility=f1, space=s3_f1, serial_number='PROJ-4K')
a6 = Asset.objects.create(name='Desk Chairs Batch Rev', asset_type='Furniture', status='RETIRED', facility=f3, space=s1_f3)

# 5. Create Maintenance Requests
MaintenanceRequest.objects.create(
    title='HVAC Preventative Maintenance',
    description='Quarterly checkup for the main HVAC unit. Filter replacement needed.',
    facility=f1,
    asset=a1,
    priority='MEDIUM',
    status='OPEN',
    due_date=date.today() + timedelta(days=7),
    reported_by=admin_user,
    assigned_to=employee
)

MaintenanceRequest.objects.create(
    title='Fix flickering lobby screen',
    description='The main display screen in the lobby keeps flickering during presentations. HDMI cable might be loose.',
    facility=f1,
    space=s1_f1,
    asset=a4,
    priority='HIGH',
    status='IN_PROGRESS',
    due_date=date.today() + timedelta(days=2),
    reported_by=admin_user,
    assigned_to=employee
)

MaintenanceRequest.objects.create(
    title='Water leak in Cafeteria',
    description='Small leak reported under the beverage station counter near the espresso machine.',
    facility=f2,
    space=s2_f2,
    asset=a3,
    priority='CRITICAL',
    status='RESOLVED',
    due_date=date.today() - timedelta(days=1),
    reported_by=employee_user,
    assigned_to=employee
)

MaintenanceRequest.objects.create(
    title='Setup more desks in co-working area',
    description='Need 5 more connected desks set up by end of the week for new hires. The old ones are retired.',
    facility=f3,
    space=s1_f3,
    priority='LOW',
    status='OPEN',
    due_date=date.today() + timedelta(days=14),
    reported_by=admin_user
)

MaintenanceRequest.objects.create(
    title='Replace Boardroom Projector Bulb',
    description='Projector bulb is showing its end of life warning.',
    facility=f1,
    space=s3_f1,
    asset=a5,
    priority='MEDIUM',
    status='CLOSED',
    due_date=date.today() - timedelta(days=5),
    reported_by=admin_user,
    assigned_to=employee
)

print('Successfully seeded 3 Facilities, 7 Spaces, 6 Assets, and 5 Maintenance Requests!')
