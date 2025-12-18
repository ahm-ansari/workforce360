from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AttendanceViewSet,
    LeaveTypeViewSet,
    LeaveViewSet,
    DocumentCategoryViewSet,
    DocumentViewSet
)

router = DefaultRouter()
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'leave-types', LeaveTypeViewSet)
router.register(r'leaves', LeaveViewSet)
router.register(r'document-categories', DocumentCategoryViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
