import os
import django
import random
from datetime import datetime, timedelta

# Set up Django
import dotenv
dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.support.models import TicketCategory, SupportTicket, TicketMessage
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_support():
    print("Seeding Support Module...")
    
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
    
    # 2. Tickets
    users = list(User.objects.all())
    if not users:
        print("No users found. Please seed users first.")
        return

    staff_users = list(User.objects.filter(is_staff=True))
    if not staff_users:
        staff_users = users[:2]

    subjects = [
        "Unable to access the CRM portal",
        "Error in monthly payroll calculation",
        "New contractor onboarding request",
        "Project Alpha milestone delay notice",
        "Facility HVAC unit abnormal noise",
        "Invoice #INV-2024-001 dispute",
        "Request for additional cloud storage",
        "Missing attendance records for last week",
    ]

    for i in range(15):
        user = random.choice(users)
        assigned_to = random.choice(staff_users) if random.random() > 0.3 else None
        status = random.choice(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
        priority = random.choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
        
        ticket = SupportTicket.objects.create(
            user=user,
            category=random.choice(cat_objs),
            title=random.choice(subjects),
            description="I am experiencing issues with the system. Please help me resolve this. This is a sample ticket description generated for testing purposes.",
            status=status,
            priority=priority,
            assigned_to=assigned_to,
            created_at=timezone_now() - timedelta(days=random.randint(1, 15))
        )
        
        # 3. Messages
        num_messages = random.randint(1, 5)
        for j in range(num_messages):
            msg_user = user if j % 2 == 0 else (assigned_to or random.choice(staff_users))
            TicketMessage.objects.create(
                ticket=ticket,
                user=msg_user,
                message=f"This is a sample message #{j+1} for ticket {ticket.ticket_id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                is_internal=random.random() < 0.2 if msg_user.is_staff else False
            )

    print("Support module seeded successfully!")

def timezone_now():
    from django.utils import timezone
    return timezone.now()

if __name__ == "__main__":
    seed_support()
