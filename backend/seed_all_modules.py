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
from apps.users.models import Role, Notification
from apps.employees.models import Employee, Department, Designation
from apps.hr.models import Attendance, Leave, LeaveType, DocumentCategory, Document
from apps.tasks.models import Task, ActivityLog
from apps.finance.models import Payroll, Reimbursement, Transaction
from apps.recruitment.models import JobCategory, HiringStage, Job, Candidate, Interview
from apps.visitors.models import Visitor, GateEntry, Vehicle, Company
from apps.projects.models import Service, Solution, Project, ProjectMilestone, ProjectDocument
from apps.outsourcing.models import StaffingRequest, OutsourcedStaff, StaffingContract, StaffingTimesheet
from apps.clients.models import Client, ClientContact, ClientSite
from apps.marketing.models import MarketingAnalysis, MarketingStrategy, MarketingPlan, MarketingCampaign
from apps.sales.models import Quotation, QuotationItem, WorkOrder, Invoice, InvoiceItem, Payment
from apps.cafm.models import Facility, Space, Asset, MaintenanceRequest, MaintenanceLog

User = get_user_model()

def seed_all():
    print("Starting Comprehensive Data Seeding for all modules...")
    
    # Get common data
    employees = list(Employee.objects.all())
    departments = list(Department.objects.all())
    users = list(User.objects.all())
    
    if not employees:
        print("Please run basic seed first to create employees.")
        return

    # 1. Users - Notifications
    try:
        print("Seeding Notifications...")
        Notification.objects.all().delete()
        for _ in range(20):
            Notification.objects.create(
                user=random.choice(users),
                title=f"Notification {random.randint(1000, 9999)}",
                message="Sample notification message.",
                notification_type=random.choice(['TASK', 'LEAVE', 'ATTENDANCE', 'DOCUMENT', 'PAYROLL', 'RECRUITMENT', 'VISITOR', 'GENERAL']),
                is_read=random.choice([True, False])
            )
    except Exception as e:
        print(f"Error seeding Notifications: {e}")

    # 2. HR - Documents
    try:
        print("Seeding HR Documents...")
        Document.objects.all().delete()
        doc_categories = list(DocumentCategory.objects.all())
        if doc_categories:
            for _ in range(15):
                Document.objects.create(
                    employee=random.choice(employees),
                    category=random.choice(doc_categories),
                    title=f"Doc-{random.randint(1000, 9999)}",
                    description="Sample HR document description."
                )
    except Exception as e:
        print(f"Error seeding Documents: {e}")

    # 3. Tasks - Activity Logs
    try:
        print("Seeding Task Activity Logs...")
        ActivityLog.objects.all().delete()
        tasks = list(Task.objects.all())
        if tasks:
            for _ in range(30):
                ActivityLog.objects.create(
                    task=random.choice(tasks),
                    user=random.choice(users),
                    action=random.choice(['CREATED', 'UPDATED', 'STATUS_CHANGED', 'COMMENT_ADDED']),
                )
    except Exception as e:
        print(f"Error seeding ActivityLogs: {e}")

    # 4. Recruitment - Full Pipeline
    try:
        print("Seeding Recruitment Module...")
        Interview.objects.all().delete()
        Candidate.objects.all().delete()
        Job.objects.all().delete()
        JobCategory.objects.all().delete()
        HiringStage.objects.all().delete()
        
        categories = []
        for name in ['Engineering', 'Sales', 'Marketing', 'Facility Management', 'HR', 'Finance']:
            cat = JobCategory.objects.create(name=name, description=f"Jobs related to {name}")
            categories.append(cat)
            
        stages = []
        for i, name in enumerate(['Applied', 'Screening', 'Technical Interview', 'HR Interview', 'Management Review', 'Offer', 'Hired']):
            stage = HiringStage.objects.create(name=name, order=i, is_active=True)
            stages.append(stage)
            
        job_titles = ['Junior Frontend Developer', 'HVAC Technician', 'Account Manager', 'Sales Representative', 'HR Specialist', 'Civil Engineer']
        jobs = []
        for title in job_titles:
            j = Job.objects.create(
                title=title,
                description="Complete job description.",
                department=random.choice(departments),
                job_category=random.choice(categories),
                status='PUBLISHED',
                posted_by=random.choice(users),
                posted_date=date.today() - timedelta(days=random.randint(5, 20)),
                closing_date=date.today() + timedelta(days=20),
                experience_level=random.choice(['ENTRY', 'MID', 'SENIOR']),
                employment_type='FULL_TIME'
            )
            jobs.append(j)
            
        candidate_names = ['Alice Freeman', 'Mark Spencer', 'Sofia Garcia', 'Kevin Chen', 'Emma Watson', 'Liam Neeson']
        for name in candidate_names:
            job = random.choice(jobs)
            c = Candidate.objects.create(
                name=name,
                email=f"{name.lower().replace(' ', '.')}@{random.randint(10,99)}example.com",
                phone=f"+1 {random.randint(100, 999)}-555-{random.randint(1000, 9999)}",
                job=job,
                current_stage=random.choice(stages),
                status=random.choice(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED'])
            )
            Interview.objects.create(
                candidate=c,
                interviewer=random.choice(users),
                interview_type=random.choice(['PHONE', 'VIDEO', 'IN_PERSON']),
                scheduled_date=date.today() + timedelta(days=random.randint(1, 10)),
                scheduled_time=time(10, 0),
                status='SCHEDULED'
            )
    except Exception as e:
        print(f"Error seeding Recruitment: {e}")

    # 5. Clients & Visitors
    try:
        print("Seeding Client Base...")
        client_names = ['TechCorp Industries', 'Global Logistics Ltd', 'Innovate Solutions', 'Mainstream Energy']
        for name in client_names:
            c, _ = Client.objects.get_or_create(
                name=name,
                defaults={
                    'industry': random.choice(['Technology', 'Logistics', 'Energy', 'Finance']),
                    'website': f"http://www.{name.lower().replace(' ', '')}{random.randint(1,99)}.com",
                }
            )
            ClientSite.objects.get_or_create(
                client=c,
                site_name="Main Site",
                defaults={
                    'address': "123 Business Road, Corporate Park",
                    'city': "Mumbai",
                    'country': "India"
                }
            )
    except Exception as e:
        print(f"Error seeding Clients: {e}")

    try:
        print("Seeding Visitors Module...")
        GateEntry.objects.all().delete()
        Vehicle.objects.all().delete()
        Visitor.objects.all().delete()
        Company.objects.all().delete()
        
        visitor_companies = []
        for name in ['External Partners', 'Service Providers', 'Local Vendors', 'Cleaning Experts']:
            comp = Company.objects.create(name=name, address="Industrial Area", phone=f"98{random.randint(10000000, 99999999)}")
            visitor_companies.append(comp)
            
        for i in range(5):
            comp = random.choice(visitor_companies)
            v = Visitor.objects.create(
                name=f"Visitor {random.randint(1, 9999)}",
                phone=f"+91 {random.randint(7000, 9999)}000{i}",
                company=comp.name,
                purpose_of_visit="Business meeting",
                id_proof_type='PASSPORT',
                id_proof_number=f"P-{random.randint(10000, 99999)}"
            )
            GateEntry.objects.create(
                visitor=v,
                entry_type='VISITOR',
                gate_number='1'
            )
            Vehicle.objects.create(
                visitor=v,
                vehicle_number=f"MH-{random.randint(10, 99)}-AB-{random.randint(1000, 9999)}",
                vehicle_type='CAR'
            )
    except Exception as e:
        print(f"Error seeding Visitors: {e}")

    # 6. Projects
    try:
        print("Seeding Projects Module...")
        ProjectMilestone.objects.all().delete()
        Project.objects.all().delete()
        Solution.objects.all().delete()
        Service.objects.all().delete()
        
        all_visitor_companies = list(Company.objects.all())
        if not all_visitor_companies:
             raise Exception("No visitor companies found for projects")
             
        # Create some services and solutions
        srv = Service.objects.create(name="Facility Maintenance", category='SUPPORT', pricing_type='FIXED', base_price=Decimal('5000.00'))
        sol = Solution.objects.create(name="Smart Energy Management", category='CLOUD', technology_stack="Python, IoT", features="Monitoring, Automation")

        projects = []
        for i in range(5):
            p = Project.objects.create(
                name=f"Project {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][i]}",
                description="Project overview.",
                start_date=date.today() - timedelta(days=random.randint(10, 50)),
                end_date=date.today() + timedelta(days=90),
                status=random.choice(['PLANNING', 'IN_PROGRESS', 'COMPLETED']),
                company=random.choice(all_visitor_companies),
                service=srv,
                solution=sol
            )
            projects.append(p)
            for j in range(3):
                ProjectMilestone.objects.create(
                    project=p,
                    title=f"Milestone {j+1}",
                    description="Deliverable",
                    due_date=p.start_date + timedelta(days=(j+1)*30),
                    status=random.choice(['PENDING', 'COMPLETED'])
                )
    except Exception as e:
        print(f"Error seeding Projects: {e}")

    # 7. Outsourcing
    try:
        print("Seeding Outsourcing Module...")
        StaffingContract.objects.all().delete()
        StaffingRequest.objects.all().delete()
        companies = list(Company.objects.all())
        for _ in range(5):
            req = StaffingRequest.objects.create(
                client=random.choice(companies) if companies else None,
                title=f"Req-{random.randint(10000, 99999)}",
                description="Staffing needs.",
                start_date=date.today(),
                end_date=date.today() + timedelta(days=180),
                status=random.choice(['PENDING', 'APPROVED', 'FULLFILLED'])
            )
            StaffingContract.objects.create(
                client=req.client,
                contract_number=f"CONT-{random.randint(100000, 999999)}",
                start_date=date.today(),
                end_date=date.today() + timedelta(days=180),
                terms_and_conditions="Sample terms of service for staffing."
            )
    except Exception as e:
        print(f"Error seeding Outsourcing: {e}")

    # 8. Marketing
    try:
        print("Seeding Marketing Module...")
        MarketingCampaign.objects.all().delete()
        MarketingPlan.objects.all().delete()
        MarketingStrategy.objects.all().delete()
        MarketingAnalysis.objects.all().delete()
        for _ in range(3):
            analysis = MarketingAnalysis.objects.create(
                title=f"Market Analysis {random.randint(1000, 9999)}",
                strengths="High brand value",
                weaknesses="Low digital presence",
                opportunities="Emerging markets",
                threats="Intense competition",
                market_trends="AI integration",
                competitor_analysis="Analyzed top 5 rivals",
                created_by=random.choice(users)
            )
            strategy = MarketingStrategy.objects.create(
                analysis=analysis,
                title="Growth Strategy",
                target_audience="Corporate Managers",
                value_proposition="Efficiency and ROI",
                key_channels="LinkedIn, Industry Events",
                objectives="Increase market share by 5%"
            )
            plan = MarketingPlan.objects.create(
                strategy=strategy,
                title="Q2 Execution Plan",
                description="Aggressive marketing campaign",
                budget=Decimal('15000.00'),
                start_date=date.today(),
                end_date=date.today() + timedelta(days=90),
                status='APPROVED'
            )
            MarketingCampaign.objects.create(
                plan=plan,
                name=f"Campaign {random.randint(1000, 9999)}",
                platform="LinkedIn Ads",
                budget_allocated=Decimal('8000.00'),
                start_date=date.today(),
                end_date=date.today() + timedelta(days=30),
                kpis="1000 clicks, 50 leads",
                metrics_achieved="Pending"
            )
    except Exception as e:
        print(f"Error seeding Marketing: {e}")

    # 9. Sales
    try:
        print("Seeding Sales Module...")
        Payment.objects.all().delete()
        InvoiceItem.objects.all().delete()
        Invoice.objects.all().delete()
        WorkOrder.objects.all().delete()
        QuotationItem.objects.all().delete()
        Quotation.objects.all().delete()
        
        active_clients = list(Client.objects.all())
        for i in range(5):
            if not active_clients: break
            client = random.choice(active_clients)
            # Use very unique numbers to avoid collisions
            rand_suffix = random.randint(100000, 999999)
            q = Quotation.objects.create(
                quotation_number=f"QT-{rand_suffix}",
                client=client,
                date=date.today(),
                expiry_date=date.today() + timedelta(days=30),
                status='ACCEPTED',
                subtotal=Decimal('12000.00'),
                tax_amount=Decimal('2160.00'),
                total_amount=Decimal('14160.00'),
                created_by=random.choice(users),
                notes="Standard quotation",
                terms="Net 30"
            )
            QuotationItem.objects.create(
                quotation=q,
                description="Consultancy Services",
                quantity=Decimal('12.00'),
                unit_price=Decimal('1000.00'),
                total=Decimal('12000.00')
            )
            wo = WorkOrder.objects.create(
                quotation=q,
                client=client,
                work_order_number=f"WO-{rand_suffix}",
                start_date=date.today(),
                status='PENDING',
                description="Implementation",
                total_value=q.total_amount
            )
            inv = Invoice.objects.create(
                work_order=wo,
                client=client,
                invoice_number=f"INV-{rand_suffix}",
                issue_date=date.today(),
                due_date=date.today() + timedelta(days=30),
                status='PAID',
                subtotal=q.subtotal,
                tax_amount=q.tax_amount,
                total_amount=q.total_amount
            )
            InvoiceItem.objects.create(
                invoice=inv,
                description="Maintenance Services",
                quantity=Decimal('1.00'),
                unit_price=q.subtotal,
                total=q.subtotal
            )
            Payment.objects.create(
                invoice=inv,
                date=date.today(),
                amount=inv.total_amount,
                payment_mode='BANK_TRANSFER',
                reference_number=f"REF-{rand_suffix}"
            )
    except Exception as e:
        print(f"Error seeding Sales: {e}")

    # 10. CAFM logs
    try:
        print("Seeding CAFM Maintenance Logs...")
        MaintenanceLog.objects.all().delete()
        m_requests = list(MaintenanceRequest.objects.all())
        for r in m_requests:
            MaintenanceLog.objects.create(
                request=r,
                user=random.choice(users),
                comment="Log entry generated during seeding.",
                status_change=r.get_status_display()
            )
    except Exception as e:
        print(f"Error seeding CAFM logs: {e}")

    print("Success: Comprehensive seeding attempt completed!")

if __name__ == "__main__":
    seed_all()
