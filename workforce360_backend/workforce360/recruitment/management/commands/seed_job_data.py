from django.core.management.base import BaseCommand
from django_seed import Seed
from faker import Faker
import random
import pycountry
import string

from datetime import datetime

from recruitment.models import Job_role, RecruitmentPlan, JobOpening, Applicant, JobApplication, Screening, InterviewFeedback, EmployeeRecruited, Document
from employees.models import Employee
from person.models import Person

class Command(BaseCommand):
    help = 'Seeds the job data.'

    def handle(self, *args, **options):
        # Initialize Faker with the Indian locale
        fake_in = Faker('en_IN')
        
        # --- Seeding Users (with Indian names) ---
        seeder = Seed.seeder()
        seeder.faker.locale = 'en_IN'  # Use Indian locale for names

        start_date = datetime(2022, 1, 1)
        end_date = datetime(2025, 11, 1)

        # Generate a random date between the specified dates
        random_date = fake_in.date_between_dates(date_start=start_date, date_end=end_date)
        start_datetime = datetime(2022, 1, 1, 0, 0, 0)
        end_datetime = datetime(2025, 11, 1, 23, 59, 59)

        random_datetime = fake_in.date_time_between_dates(datetime_start=start_datetime, datetime_end=end_datetime)



        for _ in range(1000):
            try:
                Job_role.objects.create(
                    name = fake_in.job(),
                    responsibilities = fake_in.text(),
                    qualifications = fake_in.text(),
                    benefits = fake_in.text(),
                    description = fake_in.text(),
                    created_at = random_datetime,
                    updated_at = random_datetime                    
                 )
                
                #id, title, department, open_date, close_date, status, notes, created_at, created_by_id, positions_id
                RecruitmentPlan.objects.create(
                    title = fake_in.job(),
                    department = random.choice(["HR", "Finance", "IT", "Marketing", "Sales", "Operations"]),
                    open_date = random_date,
                    close_date = random_date,
                    status = random.choice(["Draft", "Open", "Closed", "Archived"]),
                    notes = fake_in.text(),
                    created_at = random_datetime,
                    created_by_id = random.randint(1, 300),
                    positions = random.choice(Job_role.objects.all()),
                )

                JobOpening.objects.create(
                    job_code = random.choices(string.capwords(string.ascii_uppercase), k=3),
                    title = fake_in.job(),
                    location = fake_in.city(),
                    description = fake_in.text(),
                    salary_min = fake_in.random_int(min=10000, max=100000),
                    salary_max = fake_in.random_int(min=10000, max=100000),
                    created_at = random_datetime,
                    hiring_manager = random.choice(Employee.objects.all()),
                    plan = random.choice(RecruitmentPlan.objects.all()),
                )

                Applicant.objects.create(
                    cv = fake_in.file_path(),
                    cover_letter = fake_in.text(),
                    created_at = random_datetime,
                    person = random.choice(Person.objects.all())
                )

                JobApplication.objects.create(
                    status = random.choice(["Applied", "Under Scrutiny", "Shortlisted", "Interviewing", "Offered", "Hired", "Rejected", "Withdrawn"]),
                    applied_at = random_datetime,
                    source = fake_in.url(),
                    applicant = random.choice(Applicant.objects.all()),
                    job = random.choice(JobOpening.objects.all())
                )

                # id, score, notes, passed, created_at, application_id, screener_id
                Screening.objects.create(
                    score = fake_in.random_int(min=1, max=10),
                    notes = fake_in.text(),
                    passed = random.choice([True, False]),
                    created_at = random_datetime,
                    application = random.choice(JobApplication.objects.all()),
                    screener = random.choice(Employee.objects.all())
                )

                InterviewFeedback.objects.create(
                    interview_type = random.choice(["Phone", "Onsite", "Panel"]),
                    date = random_date,
                    score = fake_in.random_int(min=1, max=10),
                    strengths = fake_in.text(),
                    weaknesses = fake_in.text(),
                    decision_recommendation = random.choice(["Progress", "Reject", "Offer"]),
                    created_at = random_datetime,
                    application = random.choice(JobApplication.objects.all()),
                    interviewer = random.choice(Employee.objects.all())
                )

                # id, start_date, created_at, employee_code_id, person_id, position_id, application_id
                EmployeeRecruited.objects.create(
                    start_date = random_date,
                    created_at = random_datetime,
                    employee_code = random.choice(Employee.objects.all()),
                    person = random.choice(Person.objects.all()),
                    position = random.choice(Job_role.objects.all()),
                    application = random.choice(JobApplication.objects.all())
                )

                # id, doc_type, file, uploaded_by_id, uploaded_at, metadata
                # id, owner_type, owner_id, doc_type, file, uploaded_at, metadata, uploaded_by_id
                Document.objects.create(
                    owner_type = random.choice(["applicant", "employee", "other"]),
                    owner_id = random.randint(301, 1000),
                    doc_type = fake_in.file_extension(),
                    file = fake_in.file_path(),
                    uploaded_at = random_datetime,
                    metadata = {"key": "value"},
                    uploaded_by = random.choice(Employee.objects.all())
                )

            except Exception as e:
                print(e)

                                            
        self.stdout.write(self.style.SUCCESS("Seeded Users."))