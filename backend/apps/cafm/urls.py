from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FacilityViewSet, SpaceViewSet, AssetViewSet,
    MaintenanceRequestViewSet, MaintenanceLogViewSet,
    BMSDeviceViewSet, BMSTelemetryViewSet,
    PPMScheduleViewSet, TechnicianTrainingViewSet,
    SystemAuditViewSet, CAFMAuditLogViewSet,
    MaintenanceCommunicationViewSet, VendorViewSet,
    SLAPolicyViewSet, WorkOrderStepViewSet,
    InventoryItemViewSet, cafm_analytics
)

router = DefaultRouter()
router.register(r'facilities', FacilityViewSet)
router.register(r'spaces', SpaceViewSet)
router.register(r'assets', AssetViewSet)
router.register(r'maintenance-requests', MaintenanceRequestViewSet)
router.register(r'maintenance-logs', MaintenanceLogViewSet)
router.register(r'bms-devices', BMSDeviceViewSet)
router.register(r'bms-telemetry', BMSTelemetryViewSet)
router.register(r'ppm-schedules', PPMScheduleViewSet)
router.register(r'trainings', TechnicianTrainingViewSet)
router.register(r'audits', SystemAuditViewSet)
router.register(r'audit-logs', CAFMAuditLogViewSet)
router.register(r'communications', MaintenanceCommunicationViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'sla-policies', SLAPolicyViewSet)
router.register(r'work-order-steps', WorkOrderStepViewSet)
router.register(r'inventory', InventoryItemViewSet)

urlpatterns = [
    path('analytics/', cafm_analytics, name='cafm-analytics'),
    path('', include(router.urls)),
]
