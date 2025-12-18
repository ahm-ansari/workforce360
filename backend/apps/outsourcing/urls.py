from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StaffingRequestViewSet,
    OutsourcedStaffViewSet,
    StaffingContractViewSet,
    StaffingTimesheetViewSet
)

router = DefaultRouter()
router.register(r'requests', StaffingRequestViewSet)
router.register(r'staff', OutsourcedStaffViewSet)
router.register(r'contracts', StaffingContractViewSet)
router.register(r'timesheets', StaffingTimesheetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
