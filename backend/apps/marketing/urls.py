from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MarketingAnalysisViewSet, 
    MarketingStrategyViewSet, 
    MarketingPlanViewSet, 
    MarketingCampaignViewSet
)

router = DefaultRouter()
router.register(r'analyses', MarketingAnalysisViewSet)
router.register(r'strategies', MarketingStrategyViewSet)
router.register(r'plans', MarketingPlanViewSet)
router.register(r'campaigns', MarketingCampaignViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
