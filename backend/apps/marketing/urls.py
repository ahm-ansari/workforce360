from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MarketingAnalysisViewSet,
    MarketingStrategyViewSet,
    MarketingPlanViewSet,
    MarketingCampaignViewSet,
    MarketingLeadViewSet,
    MarketingDashboardViewSet,
)

router = DefaultRouter()
router.register(r'analyses', MarketingAnalysisViewSet)
router.register(r'strategies', MarketingStrategyViewSet)
router.register(r'plans', MarketingPlanViewSet)
router.register(r'campaigns', MarketingCampaignViewSet)
router.register(r'leads', MarketingLeadViewSet)
router.register(r'dashboard', MarketingDashboardViewSet, basename='marketing-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
