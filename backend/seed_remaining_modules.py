import os
import django
from datetime import date, datetime, timedelta, time
import random
from decimal import Decimal

import pymysql
pymysql.install_as_MySQLdb()

# Set up Django
import dotenv
dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.recruitment.models import Candidate, HiringStage, CandidateStageHistory
from apps.projects.models import Project, ProjectDocument
from apps.outsourcing.models import StaffingRequest, OutsourcedStaff, StaffingTimesheet
from apps.employees.models import Employee
from apps.visitors.models import Company
from apps.clients.models import Client, ClientContact
from apps.operations.models import Deployment
from apps.sales.models import WorkOrder
from apps.cafm.models import MaintenanceRequest, MaintenanceLog

User = get_user_model()

def seed_remaining():
    print("Starting to seed missing entities...")
    
    users = list(User.objects.all())
    employees = list(Employee.objects.all())

    # 1. CandidateStageHistory
    try:
        candidates = list(Candidate.objects.all())
        stages = list(HiringStage.objects.all())
        if candidates and stages and users:
            for candidate in candidates:
                # Add random 1-3 stages history
                for _ in range(random.randint(1, 3)):
                    CandidateStageHistory.objects.create(
                        candidate=candidate,
                        stage=random.choice(stages),
                        moved_by=random.choice(users),
                        notes=f"Moved candidate during seeding process."
                    )
            print(f"Seeded CandidateStageHistory for {len(candidates)} candidates.")
    except Exception as e:
        print(f"Error seeding CandidateStageHistory: {e}")

    # 2. ProjectDocument
    try:
        projects = list(Project.objects.all())
        if projects and users:
            for project in projects:
                for i in range(2):
                    ProjectDocument.objects.create(
                        project=project,
                        title=f"{project.name} - Document {i+1}",
                        document_type=random.choice(['PROPOSAL', 'CONTRACT', 'REQUIREMENT', 'DESIGN', 'REPORT']),
                        description="Uploaded during seeding.",
                        uploaded_by=random.choice(users)
                    )
            print(f"Seeded ProjectDocument for {len(projects)} projects.")
    except Exception as e:
        print(f"Error seeding ProjectDocument: {e}")

    # 3. OutsourcedStaff
    try:
        staffing_requests = list(StaffingRequest.objects.all())
        companies = list(Company.objects.all())
        if staffing_requests and employees and companies:
            for s_req in staffing_requests:
                if random.choice([True, False]):
                    OutsourcedStaff.objects.create(
                        staffing_request=s_req,
                        employee=random.choice(employees),
                        client=random.choice(companies),
                        role="Consultant / Technician",
                        billing_rate=Decimal(random.randint(50, 150)),
                        start_date=date.today() - timedelta(days=random.randint(10, 60)),
                        end_date=date.today() + timedelta(days=random.randint(30, 90)),
                        status='ACTIVE',
                        notes="Assigned via seeding process."
                    )
            print("Seeded OutsourcedStaff.")
    except Exception as e:
        print(f"Error seeding OutsourcedStaff: {e}")

    # 4. StaffingTimesheet
    try:
        placements = list(OutsourcedStaff.objects.all())
        if placements and users:
            for placement in placements:
                for i in range(3):
                    StaffingTimesheet.objects.create(
                        placement=placement,
                        start_date=placement.start_date + timedelta(days=i*7),
                        end_date=placement.start_date + timedelta(days=(i*7)+6),
                        total_hours=Decimal(str(random.randint(30, 45))),
                        billable_amount=placement.billing_rate * Decimal(str(random.randint(30, 45))),
                        status=random.choice(['DRAFT', 'SUBMITTED', 'APPROVED', 'INVOICED']),
                        approved_by=random.choice(users)
                    )
            print(f"Seeded StaffingTimesheet for {len(placements)} placements.")
    except Exception as e:
        print(f"Error seeding StaffingTimesheet: {e}")

    # 5. ClientContact
    try:
        clients = list(Client.objects.all())
        if clients:
            first_names = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana"]
            last_names = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones"]
            for client in clients:
                for i in range(random.randint(1, 3)):
                    ClientContact.objects.create(
                        client=client,
                        first_name=random.choice(first_names),
                        last_name=random.choice(last_names),
                        designation="Manager / Director",
                        email=f"contact{random.randint(1,999)}@{client.name.replace(' ', '').lower()[:10]}.com",
                        phone=f"+1-555-{random.randint(1000, 9999)}",
                        is_primary=(i == 0)
                    )
            print("Seeded ClientContacts.")
    except Exception as e:
        print(f"Error seeding ClientContacts: {e}")

    # 6. Deployment
    try:
        clients = list(Client.objects.all())
        work_orders = list(WorkOrder.objects.all())
        if clients and employees:
            for i in range(5):
                Deployment.objects.create(
                    employee=random.choice(employees),
                    client=random.choice(clients),
                    work_order=random.choice(work_orders) if work_orders else None,
                    role_at_deployment="Technician / Specialist",
                    start_date=date.today() - timedelta(days=random.randint(5, 30)),
                    end_date=date.today() + timedelta(days=random.randint(30, 90)),
                    status=random.choice(['SCHEDULED', 'ACTIVE', 'COMPLETED']),
                    notes="Deployment generated during seeding."
                )
            print("Seeded Deployments.")
    except Exception as e:
        print(f"Error seeding Deployments: {e}")

    # 7. MaintenanceLog
    try:
        m_requests = list(MaintenanceRequest.objects.all())
        if m_requests and users:
            for req in m_requests:
                for i in range(2):
                    MaintenanceLog.objects.create(
                        request=req,
                        user=random.choice(users),
                        status_change=req.status,
                        comment=f"Log update {i+1} during seeding process."
                    )
            print(f"Seeded MaintenanceLogs for {len(m_requests)} requests.")
    except Exception as e:
        print(f"Error seeding MaintenanceLogs: {e}")

    print("Success: Remaining models seeded!")

if __name__ == "__main__":
    seed_remaining()
