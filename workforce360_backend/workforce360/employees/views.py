from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import OuterRef, Subquery, CharField, Value
from django.db.models.functions import Concat
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import Employee
from .serializers import EmployeeSerializer
from person.models import Person
from users.models import User


class EmployeePagination(PageNumberPagination):
    """Custom pagination for employee listing."""
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    RBAC-secured Employee API:
      - Admins: can list and manage all employees
      - Managers: can list only their direct reports
      - Employees: can view only their own record
    """
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = EmployeePagination

    def get_queryset(self):
        user = self.request.user

        # Only admins or staff can see all employees
        if user.is_admin or user.is_staff:
            queryset = Employee.objects.all()
        elif user.is_employee:
            # Show only the current user's employee record
            queryset = Employee.objects.filter(user=user)
        else:
            queryset = Employee.objects.none()

        # Subquery to get reporting manager's full name
        manager_name_subquery = Person.objects.filter(
            id=OuterRef("reporting_manager_id")
        ).annotate(
            full_name=Concat("first_name", Value(" "), "last_name")
        ).values("full_name")[:1]


        # Annotate manager name & prefetch related person
        queryset = (
            queryset.select_related("person", "reporting_manager")
            .annotate(
                manager_name=Subquery(manager_name_subquery, output_field=CharField())
            ).values(
                'person__first_name', 
                'person__last_name', 
                'person__date_of_birth', 
                'person__gender', 
                'emp_code', 
                'status', 
                'dataofjoining', 
                'dataofleaving', 
                'is_blocked', 
                'reporting_manager_id',
                'manager_name' # This annotated field can now be used
                ,'performance_score',  'kpis','tenure_days'
            )
            .filter(is_active=True)
            .order_by("id")
        )
        return queryset

    # --- CRUD Operations ---

    def list(self, request, *args, **kwargs):
        """List employees with pagination and RBAC filter."""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Retrieve one employee."""
        employee = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer(employee)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Create new employee (admin only)."""
        if not request.user.is_admin:
            return Response(
                {"detail": "Permission denied: only admins can create employees."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        """Update employee record."""
        employee = get_object_or_404(Employee, pk=pk)
        if not (request.user.is_admin or employee.user == request.user):
            return Response(
                {"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(employee, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        """Partially update employee."""
        employee = get_object_or_404(Employee, pk=pk)
        if not (request.user.is_admin or employee.user == request.user):
            return Response(
                {"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(employee, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        """Delete employee (admin only)."""
        if not request.user.is_admin:
            return Response(
                {"detail": "Only admins can delete employees."},
                status=status.HTTP_403_FORBIDDEN,
            )
        employee = get_object_or_404(Employee, pk=pk)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # --- Custom Actions ---

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        """Deactivate an employee."""
        if not request.user.is_admin:
            return Response(
                {"detail": "Only admins can deactivate employees."},
                status=status.HTTP_403_FORBIDDEN,
            )
        employee = get_object_or_404(Employee, pk=pk)
        employee.is_active = False
        employee.save()
        serializer = self.get_serializer(employee)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        """Activate an employee."""
        if not request.user.is_admin:
            return Response(
                {"detail": "Only admins can activate employees."},
                status=status.HTTP_403_FORBIDDEN,
            )
        employee = get_object_or_404(Employee, pk=pk)
        employee.is_active = True
        employee.save()
        serializer = self.get_serializer(employee)
        return Response(serializer.data)
