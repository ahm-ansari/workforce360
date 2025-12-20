from django.test import TestCase
from apps.finance.models import Payroll
from apps.employees.models import Employee, Department
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

class FinanceModuleTests(TestCase):
    def setUp(self):
        self.dept = Department.objects.create(name="Finance")
        self.user = User.objects.create_user(username="finance_emp", password="password123")
        self.employee = Employee.objects.create(user=self.user, department=self.dept)

    def test_payroll_calculation(self):
        payroll = Payroll.objects.create(
            employee=self.employee,
            month=12,
            year=2024,
            basic_salary=Decimal("5000.00"),
            allowances=Decimal("500.00"),
            deductions=Decimal("200.00")
        )
        self.assertEqual(payroll.net_salary, Decimal("5300.00"))
