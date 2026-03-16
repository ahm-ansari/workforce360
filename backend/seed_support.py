import os
import django
import random
from datetime import datetime, timedelta
from django.utils import timezone

# Set up Django
import dotenv
dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.support.models import TicketCategory, SupportTicket, TicketMessage, EscalationMatrix
from apps.cafm.models import Facility, Space, Asset
from apps.employees.models import Department
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_support():
    print("Seeding Enhanced Support Module with Departments and Escalations...")
    
    # 1. Categories
    categories = [
        {'name': 'Technical Support', 'description': 'Hardware, software, and IT infrastructure issues.', 'icon': 'SettingsSuggest'},
        {'name': 'Billing & Finance', 'description': 'Invoices, payments, and financial queries.', 'icon': 'AccountBalanceWallet'},
        {'name': 'HR & Recruitment', 'description': 'Employee relations, payroll, and hiring.', 'icon': 'Work'},
        {'name': 'Facility Maintenance', 'description': 'Building, plumbing, electrical, and physical assets.', 'icon': 'Engineering'},
        {'name': 'Facility & CAFM', 'description': 'Maintenance, space, and facility management.', 'icon': 'Business'},
    ]
    
    cat_objs = []
    for cat in categories:
        obj, created = TicketCategory.objects.get_or_create(
            name=cat['name'],
            defaults={'description': cat['description'], 'icon': cat['icon']}
        )
        cat_objs.append(obj)
    
    # 2. Departments
    dept_names = ['IT Support', 'HR', 'Finance', 'Facilities & HVAC', 'Security', 'Maintenance']
    depts = []
    for dname in dept_names:
        obj, created = Department.objects.get_or_create(name=dname)
        depts.append(obj)

    # 3. Escalation Matrix
    EscalationMatrix.objects.all().delete()
    for dept in depts:
        # Level 1
        EscalationMatrix.objects.create(
            department=dept,
            level=1,
            name=f"{dept.name} Executive",
            designation="Support Executive",
            phone=f"+91 98765{random.randint(10000, 99999)}",
            email=f"{dept.name.lower().replace(' ', '.')}1@wp360.com"
        )
        # Level 2
        EscalationMatrix.objects.create(
            department=dept,
            level=2,
            name=f"{dept.name} Supervisor",
            designation="Area Supervisor",
            phone=f"+91 98765{random.randint(10000, 99999)}",
            email=f"{dept.name.lower().replace(' ', '.')}2@wp360.com"
        )
        # Level 3
        EscalationMatrix.objects.create(
            department=dept,
            level=3,
            name=f"{dept.name} Manager",
            designation="Department Head",
            phone=f"+91 98765{random.randint(10000, 99999)}",
            email=f"{dept.name.lower().replace(' ', '.')}3@wp360.com"
        )

    # 4. CAFM Resources
    facilities = list(Facility.objects.all())
    spaces = list(Space.objects.all())
    assets = list(Asset.objects.all())

    # 5. Users
    users = list(User.objects.all())
    staff_users = list(User.objects.filter(is_staff=True))
    if not staff_users:
        staff_users = users[:2]

    subjects = [
        "Network switch in Rack A-1 failure",
        "HVAC system leaking water in Server Room",
        "Elevator #3 emergency alarm triggered",
        "Broken floor tile in Main Lobby",
        "Lighting panel not responding in Office B",
        "Request for workspace ergonomic assessment",
        "Access control card reader malfunction",
        "Pantry coffee machine maintenance required",
    ]

    # Clear existing tickets to re-seed with better data
    SupportTicket.objects.all().delete()

    for i in range(25):
        user = random.choice(users)
        dept = random.choice(depts)
        
        # Filter staff for this department (mocking it if we don't have enough staff data)
        # In a real system we'd check employee profiles
        assigned_to = random.choice(staff_users) if random.random() > 0.2 else None
        
        status = random.choice(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
        priority = random.choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
        
        # Link CAFM
        facility = random.choice(facilities) if facilities and random.random() > 0.4 else None
        space = None
        asset = None
        if facility:
            facility_spaces = [s for s in spaces if s.facility_id == facility.id]
            if facility_spaces:
                space = random.choice(facility_spaces)
            facility_assets = [a for a in assets if a.facility_id == facility.id]
            if facility_assets:
                asset = random.choice(facility_assets)

        created_at = timezone.now() - timedelta(days=random.randint(1, 30), hours=random.randint(0, 23))
        
        ticket = SupportTicket.objects.create(
            user=user,
            category=random.choice(cat_objs),
            department=dept,
            title=random.choice(subjects),
            description=f"Automatic report for {dept.name} issue. Needs immediate attention.",
            status=status,
            priority=priority,
            assigned_to=assigned_to,
            facility=facility,
            space=space,
            asset=asset,
            created_at=created_at
        )

        if assigned_to:
            ticket.assigned_at = created_at + timedelta(hours=random.randint(1, 4))
        if status in ['IN_PROGRESS', 'RESOLVED', 'CLOSED']:
            ticket.first_response_at = (ticket.assigned_at or created_at) + timedelta(minutes=random.randint(15, 120))
        if status in ['RESOLVED', 'CLOSED']:
            ticket.resolved_at = ticket.first_response_at + timedelta(hours=random.randint(2, 48))
        
        ticket.sla_deadline = created_at + timedelta(hours=24)
        ticket.save()
        
        # Messages
        num_messages = random.randint(1, 4)
        for j in range(num_messages):
            msg_user = user if j % 2 == 0 else (assigned_to or random.choice(staff_users))
            TicketMessage.objects.create(
                ticket=ticket,
                user=msg_user,
                message=f"Investigation for {dept.name} ticket in progress.",
                created_at=created_at + timedelta(minutes=(j+1)*60)
            )

    print("Enhanced Support module with Escalations seeded successfully!")

if __name__ == "__main__":
    seed_support()
