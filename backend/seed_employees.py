"""
Comprehensive Employee Seeding Script for Workforce360
Seeds employees for ALL departments with realistic names, designations, phone numbers, and joining dates.
"""

import os
import sys
import django
import random
from datetime import date, timedelta

# ── Django setup ────────────────────────────────────────────────────────────────
try:
    import dotenv
    dotenv.load_dotenv()
except ImportError:
    pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.employees.models import Department, Designation, Employee
from apps.users.models import Role

User = get_user_model()

# ── Configuration ────────────────────────────────────────────────────────────────

DEPARTMENTS_CONFIG = {
    'IT Support': {
        'description': 'Information Technology and helpdesk support team.',
        'designations': [
            'IT Support Executive',
            'Network Administrator',
            'Systems Engineer',
            'IT Team Lead',
            'Helpdesk Specialist',
        ],
        'staff': [
            ('Arjun',   'Mehta',     'arjun.mehta'),
            ('Priya',   'Sharma',    'priya.sharma'),
            ('Rahul',   'Gupta',     'rahul.gupta'),
            ('Sneha',   'Nair',      'sneha.nair'),
            ('Vikram',  'Rajput',    'vikram.rajput'),
        ],
    },
    'HR': {
        'description': 'Human Resources — recruitment, payroll and employee welfare.',
        'designations': [
            'HR Executive',
            'HR Generalist',
            'Talent Acquisition Specialist',
            'HR Team Lead',
            'Payroll Officer',
        ],
        'staff': [
            ('Nidhi',    'Verma',     'nidhi.verma'),
            ('Suresh',   'Kumar',     'suresh.kumar'),
            ('Anjali',   'Mishra',    'anjali.mishra'),
            ('Deepak',   'Singh',     'deepak.singh'),
            ('Kavya',    'Reddy',     'kavya.reddy'),
        ],
    },
    'Finance': {
        'description': 'Finance, accounts and budgeting department.',
        'designations': [
            'Finance Executive',
            'Accountant',
            'Senior Accountant',
            'Finance Analyst',
            'Finance Manager',
        ],
        'staff': [
            ('Manoj',    'Patel',     'manoj.patel'),
            ('Rekha',    'Joshi',     'rekha.joshi'),
            ('Amit',     'Shah',      'amit.shah'),
            ('Pooja',    'Bhatt',     'pooja.bhatt'),
            ('Kiran',    'Desai',     'kiran.desai'),
        ],
    },
    'Facilities & HVAC': {
        'description': 'Facilities management, HVAC systems and building maintenance.',
        'designations': [
            'HVAC Support Executive',
            'Facilities Technician',
            'HVAC Specialist',
            'Facilities Supervisor',
            'Maintenance Engineer',
        ],
        'staff': [
            ('Ravi',     'Shankar',   'ravi.shankar'),
            ('Sunil',    'Jain',      'sunil.jain'),
            ('Meena',    'Kulkarni',  'meena.kulkarni'),
            ('Prakash',  'Yadav',     'prakash.yadav'),
            ('Geeta',    'Tiwari',    'geeta.tiwari'),
        ],
    },
    'Security': {
        'description': 'Physical security, access control and surveillance.',
        'designations': [
            'Security Guard',
            'Security Supervisor',
            'CCTV Operator',
            'Access Control Officer',
            'Security Team Lead',
        ],
        'staff': [
            ('Ramesh',   'Chauhan',   'ramesh.chauhan'),
            ('Suresh',   'Thakur',    'suresh.thakur'),
            ('Pankaj',   'Dubey',     'pankaj.dubey'),
            ('Suman',    'Pandey',    'suman.pandey'),
            ('Ajay',     'Rawat',     'ajay.rawat'),
        ],
    },
    'Maintenance': {
        'description': 'General maintenance, civil works and repairs.',
        'designations': [
            'Maintenance Technician',
            'Electrician',
            'Plumber',
            'Civil Maintenance Officer',
            'Maintenance Supervisor',
        ],
        'staff': [
            ('Dilip',    'Sawant',    'dilip.sawant'),
            ('Nitin',    'Patil',     'nitin.patil'),
            ('Shyam',    'Lal',       'shyam.lal'),
            ('Bhavesh',  'More',      'bhavesh.more'),
            ('Seema',    'Kadam',     'seema.kadam'),
        ],
    },
    # Also cover the departments from the old seed_data for completeness
    'Engineering': {
        'description': 'Software and systems engineering.',
        'designations': [
            'Software Engineer',
            'Senior Engineer',
            'DevOps Engineer',
            'QA Engineer',
            'Engineering Lead',
        ],
        'staff': [
            ('Aditya',   'Kapoor',    'aditya.kapoor'),
            ('Ritika',   'Sinha',     'ritika.sinha'),
            ('Gaurav',   'Malhotra',  'gaurav.malhotra'),
            ('Tanvi',    'Agarwal',   'tanvi.agarwal'),
            ('Rohan',    'Bose',      'rohan.bose'),
        ],
    },
    'Human Resources': {
        'description': 'Corporate HR department.',
        'designations': [
            'HR Officer',
            'HR Coordinator',
            'HR Manager',
            'Compensation Analyst',
            'Training Specialist',
        ],
        'staff': [
            ('Leena',    'Biswas',    'leena.biswas'),
            ('Tarun',    'Saxena',    'tarun.saxena'),
            ('Mona',     'Roy',       'mona.roy'),
        ],
    },
    'Sales': {
        'description': 'Sales and business development team.',
        'designations': [
            'Sales Executive',
            'Senior Sales Executive',
            'Business Development Manager',
            'Account Manager',
            'Sales Lead',
        ],
        'staff': [
            ('Harsh',    'Vardhan',   'harsh.vardhan'),
            ('Divya',    'Menon',     'divya.menon'),
            ('Kartik',   'Iyer',      'kartik.iyer'),
            ('Pallavi',  'Naik',      'pallavi.naik'),
        ],
    },
    'Marketing': {
        'description': 'Marketing, branding and communications.',
        'designations': [
            'Marketing Executive',
            'Content Strategist',
            'SEO Specialist',
            'Brand Manager',
            'Marketing Lead',
        ],
        'staff': [
            ('Ishaan',   'Khanna',    'ishaan.khanna'),
            ('Ruchika',  'Suri',      'ruchika.suri'),
            ('Pranav',   'Dua',       'pranav.dua'),
        ],
    },
}

PHONE_PREFIXES = ['+91 98', '+91 97', '+91 96', '+91 90', '+91 88', '+91 70']

def rand_date():
    """Random joining date in past 1-5 years."""
    return date.today() - timedelta(days=random.randint(180, 1800))

def rand_phone():
    return f"{random.choice(PHONE_PREFIXES)}{random.randint(10000000, 99999999)}"

def rand_address():
    streets = ['MG Road', 'Linking Road', 'Brigade Road', 'Anna Salai', 'Park Street']
    cities  = ['Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Delhi']
    return f"{random.randint(1,200)}, {random.choice(streets)}, {random.choice(cities)}"

# ── Main seeding function ────────────────────────────────────────────────────────

def seed():
    print("\n" + "="*60)
    print("  Workforce360 — Employee Seeding")
    print("="*60 + "\n")

    # Ensure roles exist
    employee_role, _ = Role.objects.get_or_create(
        name='employee', defaults={'description': 'Regular employee'}
    )
    manager_role, _ = Role.objects.get_or_create(
        name='manager', defaults={'description': 'Department manager'}
    )

    total_created = 0
    total_skipped = 0

    for dept_name, config in DEPARTMENTS_CONFIG.items():
        print(f"📂  Department: {dept_name}")

        # ── 1. Create/get Department ──────────────────────────────────────────
        dept, dept_created = Department.objects.get_or_create(
            name=dept_name,
            defaults={'description': config['description']}
        )
        if dept_created:
            print(f"    ✅ Created department")
        else:
            print(f"    ✓  Dept exists")

        # ── 2. Create Designations ────────────────────────────────────────────
        desig_objs = {}
        for desig_name in config['designations']:
            desig, _ = Designation.objects.get_or_create(
                name=desig_name,
                department=dept,
                defaults={'description': f'{desig_name} role in {dept_name}'}
            )
            desig_objs[desig_name] = desig

        print(f"    ✅ {len(desig_objs)} designations ready")

        # ── 3. Create Employees ───────────────────────────────────────────────
        for idx, (first_name, last_name, username) in enumerate(config['staff']):
            # Create or get user
            user, user_created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@workforce360.com',
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': manager_role if idx == len(config['staff']) - 1 else employee_role,
                    'is_staff': idx >= len(config['staff']) - 2,  # Last 2 are staff/supervisors
                }
            )
            if user_created:
                user.set_password('staff@123')
                user.save()

            # Pick a designation (cycle through them)
            desig_name = config['designations'][idx % len(config['designations'])]
            desig = desig_objs[desig_name]

            # Create Employee profile
            emp, emp_created = Employee.objects.get_or_create(
                user=user,
                defaults={
                    'department': dept,
                    'designation': desig,
                    'date_of_joining': rand_date(),
                    'address': rand_address(),
                    'emergency_contact': rand_phone(),
                }
            )

            if emp_created:
                total_created += 1
                print(f"    ➕ {first_name} {last_name} — {desig_name}")
            else:
                # Update department if employee existed but dept changed
                updated = False
                if emp.department != dept:
                    emp.department = dept
                    updated = True
                if emp.designation != desig:
                    emp.designation = desig
                    updated = True
                if updated:
                    emp.save()
                    print(f"    🔄 Updated {first_name} {last_name} → {dept_name}")
                else:
                    total_skipped += 1

        print()

    print("="*60)
    print(f"  ✅ Done! {total_created} employees created, {total_skipped} already existed.")
    print()
    print("  🔑 Login credentials:")
    print("     All new staff users → password: staff@123")
    print("="*60 + "\n")

if __name__ == '__main__':
    seed()
