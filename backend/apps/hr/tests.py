from django.test import TestCase
from apps.hr.models import Attendance, LeaveType, Leave
from apps.employees.models import Employee, Department
from django.contrib.auth import get_user_model
from django.utils import timezone
import datetime

User = get_user_model()

class HRModuleTests(TestCase):
    def setUp(self):
        self.dept = Department.objects.create(name="Human Resources")
        self.user = User.objects.create_user(username="hr_user", password="password123")
        self.employee = Employee.objects.create(user=self.user, department=self.dept)
        self.leave_type = LeaveType.objects.create(name="Sick Leave", max_days_per_year=15)

    def test_attendance_work_hours_calculation(self):
        check_in = datetime.time(9, 0) # 09:00 AM
        check_out = datetime.time(17, 30) # 05:30 PM
        attendance = Attendance.objects.create(
            employee=self.employee,
            date=timezone.now().date(),
            check_in=check_in,
            check_out=check_out,
            status='PRESENT'
        )
        # 8.5 hours
        self.assertEqual(float(attendance.work_hours), 8.5)

    def test_leave_request_creation(self):
        start_date = timezone.now().date()
        end_date = start_date + datetime.timedelta(days=2)
        leave = Leave.objects.create(
            employee=self.employee,
            leave_type=self.leave_type,
            start_date=start_date,
            end_date=end_date,
            reason="Feeling unwell",
            status="PENDING"
        )
        self.assertEqual(leave.employee, self.employee)
        self.assertEqual(leave.status, "PENDING")
        self.assertEqual(leave.leave_type.name, "Sick Leave")
