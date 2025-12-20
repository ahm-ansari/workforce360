from django.test import TestCase
from apps.outsourcing.models import StaffingRequest, OutsourcedStaff
from apps.visitors.models import Company
from apps.employees.models import Employee, Department
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal

User = get_user_model()

class OutsourcingModuleTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Tech Corp", website="https://tech.corp")
        self.dept = Department.objects.create(name="HR")
        self.user = User.objects.create_user(username="staff_user", password="password123")
        self.employee = Employee.objects.create(user=self.user, department=self.dept)

    def test_staffing_request_creation(self):
        request = StaffingRequest.objects.create(
            client=self.company,
            title="React Developer",
            description="Need a dev",
            required_skills="React, Node",
            start_date=timezone.now().date(),
            status="OPEN"
        )
        self.assertEqual(request.title, "React Developer")
        self.assertEqual(request.client.name, "Tech Corp")

    def test_outsourced_staff_placement(self):
        request = StaffingRequest.objects.create(
            client=self.company,
            title="React Developer",
            description="Need a dev",
            required_skills="React, Node",
            start_date=timezone.now().date()
        )
        placement = OutsourcedStaff.objects.create(
            staffing_request=request,
            employee=self.employee,
            client=self.company,
            role="Lead Developer",
            billing_rate=Decimal("50.00"),
            start_date=timezone.now().date()
        )
        self.assertEqual(placement.role, "Lead Developer")
        self.assertEqual(placement.employee.user.username, "staff_user")
