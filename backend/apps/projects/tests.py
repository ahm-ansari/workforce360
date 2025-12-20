from django.test import TestCase
from apps.projects.models import Project, Service, Solution, ProjectMilestone
from apps.visitors.models import Company
from apps.employees.models import Employee, Department
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
import datetime

User = get_user_model()

class ProjectsModuleTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Global Ltd")
        self.dept = Department.objects.create(name="Product")
        self.user = User.objects.create_user(username="pm_user", password="password123")
        self.pm = Employee.objects.create(user=self.user, department=self.dept)
        self.service = Service.objects.create(
            name="Web Development",
            category="DEVELOPMENT",
            pricing_type="FIXED",
            base_price=Decimal("10000.00")
        )

    def test_project_budget_utilization(self):
        project = Project.objects.create(
            name="E-commerce Platform",
            company=self.company,
            service=self.service,
            budget=Decimal("15000.00"),
            actual_cost=Decimal("7500.00"),
            project_manager=self.pm
        )
        self.assertEqual(project.budget_utilization, 50.0)
        self.assertFalse(project.is_overbudget)

        project.actual_cost = Decimal("16000.00")
        project.save()
        self.assertTrue(project.is_overbudget)

    def test_milestone_overdue_logic(self):
        project = Project.objects.create(
            name="App Launch",
            company=self.company,
            budget=Decimal("5000.00")
        )
        past_date = timezone.now().date() - datetime.timedelta(days=5)
        milestone = ProjectMilestone.objects.create(
            project=project,
            title="Design Phase",
            due_date=past_date,
            status="PENDING"
        )
        self.assertTrue(milestone.is_overdue)

        milestone.status = "COMPLETED"
        milestone.save()
        self.assertFalse(milestone.is_overdue)
