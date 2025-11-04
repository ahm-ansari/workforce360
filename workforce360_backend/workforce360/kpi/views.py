# kpi/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employees.models import Employee, Employee_Attendance, Employee_Payroll, EmployeeKPI
from django.db import models


class KPISummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_employees = Employee.objects.count()
        avg_salary = Employee_Payroll.objects.aggregate(avg=models.Avg("salary"))["avg"] or 0
        avg_performance = Employee.objects.aggregate(avg=models.Avg("performance_score"))["avg"] or 0
        # on_time_rate = Employee_Attendance.objects.filter(avg=models.Avg("in_time")).count() / Employee_Attendance.objects.count() * 100

        data = {
            "total_employees": total_employees,
            "average_salary": round(avg_salary, 2),
            "average_performance": round(avg_performance, 2),
            # "on_time_rate": round(on_time_rate, 1),
        }
        return Response(data)
