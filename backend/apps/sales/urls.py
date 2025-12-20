from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuotationViewSet, WorkOrderViewSet, InvoiceViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'quotations', QuotationViewSet)
router.register(r'work-orders', WorkOrderViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
