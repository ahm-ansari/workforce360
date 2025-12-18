from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VisitorViewSet, GateEntryViewSet, VehicleViewSet, CompanyViewSet

router = DefaultRouter()
router.register(r'visitors', VisitorViewSet, basename='visitor')
router.register(r'gate-entries', GateEntryViewSet, basename='gateentry')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'companies', CompanyViewSet, basename='company')

urlpatterns = [
    path('', include(router.urls)),
]
