from django.test import TestCase
from apps.visitors.models import Visitor, GateEntry
from apps.employees.models import Employee, Department
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class VisitorsModuleTests(TestCase):
    def setUp(self):
        self.dept = Department.objects.create(name="Security")
        self.host_user = User.objects.create_user(username="host_emp", password="password123")
        self.host = Employee.objects.create(user=self.host_user, department=self.dept)

    def test_visitor_creation(self):
        visitor = Visitor.objects.create(
            name="Alice Smith",
            phone="9876543210",
            purpose_of_visit="Interview",
            host_employee=self.host,
            id_proof_type="NATIONAL_ID",
            id_proof_number="ID12345"
        )
        self.assertEqual(visitor.name, "Alice Smith")
        self.assertEqual(visitor.host_employee, self.host)
        self.assertFalse(visitor.is_checked_out)

    def test_gate_entry_creation(self):
        visitor = Visitor.objects.create(
            name="Bob Brown",
            phone="9876543211",
            purpose_of_visit="Delivery",
            host_employee=self.host,
            id_proof_type="OTHER"
        )
        entry = GateEntry.objects.create(
            visitor=visitor,
            gate_number="Gate 1",
            entry_type="VISITOR"
        )
        self.assertEqual(entry.visitor, visitor)
        self.assertEqual(entry.gate_number, "Gate 1")
