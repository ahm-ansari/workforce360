from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeploymentViewSet

router = DefaultRouter()
router.register(r'deployments', DeploymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
