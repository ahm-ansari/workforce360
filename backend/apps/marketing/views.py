from rest_framework import viewsets, permissions
from .models import MarketingAnalysis, MarketingStrategy, MarketingPlan, MarketingCampaign
from .serializers import (
    MarketingAnalysisSerializer, 
    MarketingStrategySerializer, 
    MarketingPlanSerializer, 
    MarketingCampaignSerializer
)

class MarketingAnalysisViewSet(viewsets.ModelViewSet):
    queryset = MarketingAnalysis.objects.all()
    serializer_class = MarketingAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class MarketingStrategyViewSet(viewsets.ModelViewSet):
    queryset = MarketingStrategy.objects.all()
    serializer_class = MarketingStrategySerializer
    permission_classes = [permissions.IsAuthenticated]

class MarketingPlanViewSet(viewsets.ModelViewSet):
    queryset = MarketingPlan.objects.all()
    serializer_class = MarketingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

class MarketingCampaignViewSet(viewsets.ModelViewSet):
    queryset = MarketingCampaign.objects.all()
    serializer_class = MarketingCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
