from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ActivityLogViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'activity-logs', ActivityLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
