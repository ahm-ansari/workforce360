import os
import django
import random
from datetime import date, datetime, timedelta, time
from decimal import Decimal
from faker import Faker

# Set up Django
import dotenv
dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.employees.models import Department
from apps.recruitment.models import JobCategory, HiringStage, Job, Candidate, CandidateStageHistory, Interview

fake = Faker()
User = get_user_model()

def seed_recruitment():
    print("Starting Advanced Recruitment Data Seeding...")
    
    # 0. Cleanup existing data
    print("Cleaning up existing recruitment data...")
    Interview.objects.all().delete()
    CandidateStageHistory.objects.all().delete()
    Candidate.objects.all().delete()
    Job.objects.all().delete()
    HiringStage.objects.all().delete()
    JobCategory.objects.all().delete()

    # 1. Fetch available foreign keys
    departments = list(Department.objects.all())
    users = list(User.objects.all())
    
    if not departments or not users:
        print("Error: Departments and Users must exist before seeding recruitment.")
        return

    # 2. Create Job Categories
    print("Creating Job Categories...")
    category_names = [
        'Engineering', 'Sales & Marketing', 'Human Resources', 'Finance', 
        'Operations', 'Facility Management', 'Information Technology', 
        'Customer Support', 'Administration', 'Legal', 'Design'
    ]
    categories = []
    for name in category_names:
        cat = JobCategory.objects.create(
            name=name,
            description=f"Job positions related to the {name} department and industry."
        )
        categories.append(cat)

    # 3. Create Hiring Stages
    print("Creating Hiring Stages...")
    stage_names = [
        'Applied', 
        'Initial Screening', 
        'Technical Assessment', 
        'HM Interview', 
        'Panel Interview', 
        'HR Round', 
        'Reference Check', 
        'Offer Extended', 
        'Hired'
    ]
    stages = []
    for i, name in enumerate(stage_names):
        stage = HiringStage.objects.create(
            name=name,
            order=i,
            is_active=True
        )
        stages.append(stage)

    # 4. Create Jobs
    print("Creating Job Postings...")
    job_templates = [
        {'title': 'Senior Full Stack Developer', 'cat': 'Engineering', 'skills': ['React', 'Node.js', 'PostgreSQL', 'AWS']},
        {'title': 'HVAC Specialist', 'cat': 'Facility Management', 'skills': ['HVAC Systems', 'Maintenance', 'Safety Protocols']},
        {'title': 'Sales Director', 'cat': 'Sales & Marketing', 'skills': ['Strategic Planning', 'Leadership', 'B2B Sales']},
        {'title': 'HR Manager', 'cat': 'Human Resources', 'skills': ['Employee Relations', 'Recruiting', 'Policy Development']},
        {'title': 'Financial Analyst', 'cat': 'Finance', 'skills': ['Financial Modeling', 'Excel Expert', 'Reporting']},
        {'title': 'DevOps Engineer', 'cat': 'Information Technology', 'skills': ['Docker', 'Kubernetes', 'CI/CD', 'Terraform']},
        {'title': 'Customer Success Lead', 'cat': 'Customer Support', 'skills': ['Communication', 'CRM', 'Problem Solving']},
        {'title': 'Project Coordinator', 'cat': 'Operations', 'skills': ['Project Management', 'Scheduling', 'Resource Allocation']},
        {'title': 'Graphic Designer', 'cat': 'Design', 'skills': ['Adobe Suite', 'Creativity', 'UI/UX Design']},
        {'title': 'Legal Consultant', 'cat': 'Legal', 'skills': ['Corporate Law', 'Contract Negotiation', 'Compliance']},
        {'title': 'Civil Engineer', 'cat': 'Engineering', 'skills': ['AutoCAD', 'Structural Design', 'Site Inspection']},
        {'title': 'Marketing Specialist', 'cat': 'Sales & Marketing', 'skills': ['SEO', 'Content Strategy', 'Google Ads']},
        {'title': 'Network Administrator', 'cat': 'Information Technology', 'skills': ['Networking', 'Security', 'Firewall Management']},
        {'title': 'Maintenance Supervisor', 'cat': 'Facility Management', 'skills': ['Facility Maintenance', 'Team Management', 'Budgeting']},
        {'title': 'Accountant', 'cat': 'Finance', 'skills': ['Taxation', 'Audit', 'QuickBooks']},
    ]

    jobs = []
    for template in job_templates:
        cat = next((c for c in categories if c.name == template['cat']), categories[0])
        dept = random.choice(departments)
        
        posted_date = date.today() - timedelta(days=random.randint(10, 60))
        status = 'PUBLISHED' if random.random() > 0.2 else random.choice(['DRAFT', 'CLOSED', 'CANCELLED'])
        
        salary_min = random.randint(4000, 15000)
        salary_max = salary_min + random.randint(2000, 10000)

        job = Job.objects.create(
            title=template['title'],
            description=fake.paragraph(nb_sentences=10),
            requirements=fake.paragraph(nb_sentences=5),
            responsibilities=fake.paragraph(nb_sentences=5),
            department=dept,
            job_category=cat,
            employment_type=random.choice(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
            experience_level=random.choice(['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE']),
            salary_range_min=Decimal(str(salary_min)),
            salary_range_max=Decimal(str(salary_max)),
            location=fake.city() + ", " + fake.country(),
            remote_option=random.choice([True, False]),
            status=status,
            posted_by=random.choice(users),
            posted_date=posted_date,
            closing_date=posted_date + timedelta(days=60),
            number_of_positions=random.randint(1, 5),
            skills_required=template['skills']
        )
        jobs.append(job)

    # 5. Create Candidates
    print(f"Creating Candidates and Applications (Target: 150)...")
    sources = ['WEBSITE', 'REFERRAL', 'LINKEDIN', 'INDEED', 'OTHER']
    status_choices = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED']
    
    candidates = []
    for i in range(150):
        job = random.choice([j for j in jobs if j.status == 'PUBLISHED'] or jobs)
        
        # Decide current stage and status
        status_roll = random.random()
        if status_roll < 0.3: # 30% still at Applied stage
            status = 'APPLIED'
            current_stage = stages[0]
        elif status_roll < 0.5: # 20% Rejected
            status = 'REJECTED'
            current_stage = random.choice(stages[:3])
        elif status_roll < 0.7: # 20% Screening
            status = 'SCREENING'
            current_stage = random.choice(stages[1:2])
        elif status_roll < 0.85: # 15% Interview
            status = 'INTERVIEW'
            current_stage = random.choice(stages[2:6])
        elif status_roll < 0.95: # 10% Offered
            status = 'OFFERED'
            current_stage = stages[7]
        else: # 5% Hired
            status = 'HIRED'
            current_stage = stages[8]

        applied_date = job.posted_date + timedelta(days=random.randint(0, 30))
        
        candidate = Candidate.objects.create(
            name=fake.name(),
            email=fake.email(),
            phone=fake.phone_number()[:20],
            cover_letter=fake.paragraph(nb_sentences=3),
            linkedin_url="https://linkedin.com/in/" + fake.user_name(),
            portfolio_url=fake.url(),
            job=job,
            current_stage=current_stage,
            status=status,
            source=random.choice(sources),
            rating=random.randint(1, 5) if status != 'APPLIED' else None,
            notes=fake.sentence()
        )
        # Manually set applied_date since it's auto_now_add
        Candidate.objects.filter(id=candidate.id).update(applied_date=applied_date)
        
        candidates.append(candidate)

        # 6. Create Stage History for some candidates
        if status != 'APPLIED':
            num_transitions = stages.index(current_stage) + 1
            for j in range(num_transitions):
                CandidateStageHistory.objects.create(
                    candidate=candidate,
                    stage=stages[j],
                    moved_by=random.choice(users),
                    notes=f"Moved to {stages[j].name} during recruitment process."
                )

        # 7. Create Interviews for some candidates
        if status in ['INTERVIEW', 'OFFERED', 'HIRED'] or (status == 'REJECTED' and random.random() > 0.5):
            num_interviews = random.randint(1, 3)
            for k in range(num_interviews):
                scheduled_date = applied_date + timedelta(days=random.randint(7, 21))
                i_status = 'COMPLETED' if scheduled_date < date.today() else 'SCHEDULED'
                
                feedback = ""
                recommendation = ""
                rating = None
                
                if i_status == 'COMPLETED':
                    feedback = fake.paragraph(nb_sentences=3)
                    recommendation = random.choice(['STRONG_HIRE', 'HIRE', 'MAYBE', 'NO_HIRE'])
                    rating = random.randint(2, 5)

                Interview.objects.create(
                    candidate=candidate,
                    interviewer=random.choice(users),
                    interview_type=random.choice(['PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'HR']),
                    scheduled_date=scheduled_date,
                    scheduled_time=time(random.randint(9, 17), 0),
                    duration=random.choice([30, 45, 60, 90]),
                    location="Online Link" if random.random() > 0.3 else "Room " + str(random.randint(101, 505)),
                    status=i_status,
                    feedback=feedback,
                    rating=rating,
                    recommendation=recommendation
                )

    print(f"Successfully seeded:")
    print(f"- {JobCategory.objects.count()} Job Categories")
    print(f"- {HiringStage.objects.count()} Hiring Stages")
    print(f"- {Job.objects.count()} Jobs")
    print(f"- {Candidate.objects.count()} Candidates")
    print(f"- {CandidateStageHistory.objects.count()} Stage History Records")
    print(f"- {Interview.objects.count()} Interviews")
    print("Recruitment Data Seeding Completed!")

if __name__ == "__main__":
    seed_recruitment()
