from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet, SolutionViewSet, ProjectViewSet, 
    ProjectMilestoneViewSet, ProjectDocumentViewSet
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'solutions', SolutionViewSet, basename='solution')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'milestones', ProjectMilestoneViewSet, basename='milestone')
router.register(r'documents', ProjectDocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
]
