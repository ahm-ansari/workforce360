from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    JobViewSet, CandidateViewSet, InterviewViewSet,
    HiringStageViewSet, CandidateStageHistoryViewSet, JobCategoryViewSet
)

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'candidates', CandidateViewSet, basename='candidate')
router.register(r'interviews', InterviewViewSet, basename='interview')
router.register(r'stages', HiringStageViewSet, basename='stage')
router.register(r'stage-history', CandidateStageHistoryViewSet, basename='stage-history')
router.register(r'categories', JobCategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
