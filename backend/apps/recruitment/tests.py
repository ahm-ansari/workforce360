from django.test import TestCase
from apps.recruitment.models import Job, Candidate, HiringStage
from apps.employees.models import Department
from django.contrib.auth import get_user_model

User = get_user_model()

class RecruitmentModuleTests(TestCase):
    def setUp(self):
        self.dept = Department.objects.create(name="Engineering")
        self.user = User.objects.create_user(username="recruiter", password="password123")
        self.stage_screening = HiringStage.objects.create(name="Screening", order=1)
        self.stage_interview = HiringStage.objects.create(name="Interview", order=2)

    def test_job_creation(self):
        job = Job.objects.create(
            title="Software Engineer",
            description="Build cool things",
            department=self.dept,
            posted_by=self.user,
            status="PUBLISHED"
        )
        self.assertEqual(job.title, "Software Engineer")
        self.assertEqual(job.status, "PUBLISHED")

    def test_candidate_creation(self):
        job = Job.objects.create(
            title="Software Engineer",
            description="Build cool things"
        )
        candidate = Candidate.objects.create(
            name="John Doe",
            email="john@example.com",
            phone="1234567890",
            job=job,
            current_stage=self.stage_screening,
            status="SCREENING"
        )
        self.assertEqual(candidate.name, "John Doe")
        self.assertEqual(candidate.current_stage.name, "Screening")
