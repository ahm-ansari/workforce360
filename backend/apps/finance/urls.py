from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayrollViewSet, ReimbursementViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r'payrolls', PayrollViewSet, basename='payroll')
router.register(r'reimbursements', ReimbursementViewSet, basename='reimbursement')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
]
