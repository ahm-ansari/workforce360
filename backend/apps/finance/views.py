from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Payroll, Reimbursement, Transaction
from .serializers import PayrollSerializer, ReimbursementSerializer, TransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.select_related('employee').all()
    serializer_class = PayrollSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['employee', 'month', 'year', 'status']
    search_fields = ['employee__first_name', 'employee__last_name']
    ordering_fields = ['year', 'month', 'net_salary']

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """Generate payroll for given month/year based on attendance (placeholder)."""
        month = request.data.get('month')
        year = request.data.get('year')
        if not month or not year:
            return Response({"detail": "Month and year required."}, status=status.HTTP_400_BAD_REQUEST)
        # Placeholder logic: create payroll for each employee with dummy salary
        from apps.employees.models import Employee
        for emp in Employee.objects.all():
            Payroll.objects.update_or_create(
                employee=emp,
                month=month,
                year=year,
                defaults={
                    'basic_salary': 50000,
                    'allowances': 5000,
                    'deductions': 2000,
                },
            )
        return Response({"detail": "Payroll generated."}, status=status.HTTP_201_CREATED)

class ReimbursementViewSet(viewsets.ModelViewSet):
    queryset = Reimbursement.objects.select_related('employee').all()
    serializer_class = ReimbursementSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['employee', 'status']
    search_fields = ['employee__first_name', 'employee__last_name', 'description']
    ordering_fields = ['amount', 'created_at']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        reimbursement = self.get_object()
        reimbursement.status = 'APPROVED'
        reimbursement.save()
        return Response({"detail": "Reimbursement approved."})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        reimbursement = self.get_object()
        reimbursement.status = 'REJECTED'
        reimbursement.save()
        return Response({"detail": "Reimbursement rejected."})

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type']
    search_fields = ['description']
    ordering_fields = ['date', 'amount']
