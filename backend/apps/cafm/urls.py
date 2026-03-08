from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FacilityViewSet,
    SpaceViewSet,
    AssetViewSet,
    MaintenanceRequestViewSet
)

router = DefaultRouter()
router.register(r'facilities', FacilityViewSet)
router.register(r'spaces', SpaceViewSet)
router.register(r'assets', AssetViewSet)
router.register(r'maintenance-requests', MaintenanceRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
