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

from apps.support.models import TicketCategory, SupportTicket, TicketMessage
from apps.cafm.models import Facility, Space, Asset
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_support():
    print("Seeding Enhanced Support Module...")
    
    # 1. Categories
    categories = [
        {'name': 'Technical Support', 'description': 'Hardware, software, and IT infrastructure issues.', 'icon': 'SettingsSuggest'},
        {'name': 'Billing & Finance', 'description': 'Invoices, payments, and financial queries.', 'icon': 'AccountBalanceWallet'},
        {'name': 'HR & Recruitment', 'description': 'Employee relations, payroll, and hiring.', 'icon': 'Work'},
        {'name': 'Project Management', 'description': 'Project timelines, deliverables, and resource planning.', 'icon': 'Assignment'},
        {'name': 'Client Relations', 'description': 'Contractual issues and client feedback.', 'icon': 'ConnectWithoutContact'},
        {'name': 'Facility & CAFM', 'description': 'Maintenance, space, and facility management.', 'icon': 'Business'},
    ]
    
    cat_objs = []
    for cat in categories:
        obj, created = TicketCategory.objects.get_or_create(
            name=cat['name'],
            defaults={'description': cat['description'], 'icon': cat['icon']}
        )
        cat_objs.append(obj)
    
    # 2. CAFM Resources
    facilities = list(Facility.objects.all())
    spaces = list(Space.objects.all())
    assets = list(Asset.objects.all())

    # 3. Users
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

    for i in range(20):
        user = random.choice(users)
        assigned_to = random.choice(staff_users) if random.random() > 0.2 else None
        status = random.choice(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
        priority = random.choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
        
        # Link CAFM if it's a facility issue
        facility = random.choice(facilities) if facilities and random.random() > 0.4 else None
        space = None
        asset = None
        if facility:
            facility_spaces = [s for s in spaces if s.facility_id == facility.id]
            if facility_spaces:
                space = random.choice(facility_spaces)
            
            # Optionally link asset
            facility_assets = [a for a in assets if a.facility_id == facility.id]
            if facility_assets:
                asset = random.choice(facility_assets)

        created_at = timezone.now() - timedelta(days=random.randint(1, 30), hours=random.randint(0, 23))
        
        ticket = SupportTicket.objects.create(
            user=user,
            category=random.choice(cat_objs),
            title=random.choice(subjects),
            description="Automatic sample description for " + (asset.name if asset else "general maintenance") + ". Reported issue requires immediate attention from the facilities team.",
            status=status,
            priority=priority,
            assigned_to=assigned_to,
            facility=facility,
            space=space,
            asset=asset,
            created_at=created_at
        )

        # Set Timing Stats
        if assigned_to:
            ticket.assigned_at = created_at + timedelta(hours=random.randint(1, 4))
        
        if status in ['IN_PROGRESS', 'RESOLVED', 'CLOSED']:
            ticket.first_response_at = (ticket.assigned_at or created_at) + timedelta(minutes=random.randint(15, 120))
        
        if status in ['RESOLVED', 'CLOSED']:
            ticket.resolved_at = ticket.first_response_at + timedelta(hours=random.randint(2, 48))
        
        ticket.sla_deadline = created_at + timedelta(hours=24)
        ticket.save()
        
        # 4. Messages
        num_messages = random.randint(2, 6)
        for j in range(num_messages):
            msg_user = user if j % 2 == 0 else (assigned_to or random.choice(staff_users))
            msg_time = created_at + timedelta(minutes=(j+1)*30)
            
            TicketMessage.objects.create(
                ticket=ticket,
                user=msg_user,
                message=f"Interaction #{j+1} regarding {ticket.ticket_id}. Status is currently {status}.",
                is_internal=random.random() < 0.1 if msg_user.is_staff else False,
                created_at=msg_time
            )

    print("Enhanced Support module seeded successfully!")

if __name__ == "__main__":
    seed_support()
