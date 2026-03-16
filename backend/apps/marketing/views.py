from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Avg, F
from .models import MarketingAnalysis, MarketingStrategy, MarketingPlan, MarketingCampaign, MarketingLead
from .serializers import (
    MarketingAnalysisSerializer,
    MarketingStrategySerializer,
    MarketingPlanSerializer,
    MarketingCampaignSerializer,
    MarketingLeadSerializer
)


class MarketingAnalysisViewSet(viewsets.ModelViewSet):
    queryset = MarketingAnalysis.objects.all()
    serializer_class = MarketingAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'strengths', 'opportunities']
    ordering_fields = ['created_at', 'title']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class MarketingStrategyViewSet(viewsets.ModelViewSet):
    queryset = MarketingStrategy.objects.all()
    serializer_class = MarketingStrategySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['analysis']
    search_fields = ['title', 'target_audience']


class MarketingPlanViewSet(viewsets.ModelViewSet):
    queryset = MarketingPlan.objects.all()
    serializer_class = MarketingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'strategy']
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'budget', 'created_at']


class MarketingCampaignViewSet(viewsets.ModelViewSet):
    queryset = MarketingCampaign.objects.all()
    serializer_class = MarketingCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['platform', 'status', 'plan']
    search_fields = ['name', 'kpis']
    ordering_fields = ['start_date', 'budget_allocated', 'impressions', 'conversions']


class MarketingLeadViewSet(viewsets.ModelViewSet):
    queryset = MarketingLead.objects.all()
    serializer_class = MarketingLeadSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'source', 'campaign', 'assigned_to']
    search_fields = ['name', 'email', 'company']
    ordering_fields = ['created_at', 'estimated_value']

    def perform_create(self, serializer):
        serializer.save()


class MarketingDashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        campaigns = MarketingCampaign.objects.all()
        leads = MarketingLead.objects.all()
        plans = MarketingPlan.objects.all()

        total_budget = campaigns.aggregate(total=Sum('budget_allocated'))['total'] or 0
        total_spent = campaigns.aggregate(total=Sum('budget_spent'))['total'] or 0
        total_revenue = campaigns.aggregate(total=Sum('revenue_generated'))['total'] or 0
        total_impressions = campaigns.aggregate(total=Sum('impressions'))['total'] or 0
        total_clicks = campaigns.aggregate(total=Sum('clicks'))['total'] or 0
        total_conversions = campaigns.aggregate(total=Sum('conversions'))['total'] or 0

        # Campaign by platform
        platform_dist = list(campaigns.values('platform').annotate(count=Count('id'), budget=Sum('budget_spent')).order_by('-count'))

        # Campaign by status
        status_dist = list(campaigns.values('status').annotate(count=Count('id')))

        # Lead pipeline
        lead_pipeline = list(leads.values('status').annotate(count=Count('id'), value=Sum('estimated_value')))

        # Lead source breakdown
        lead_sources = list(leads.values('source').annotate(count=Count('id')))

        # Top campaigns by conversions
        top_campaigns = list(
            campaigns.order_by('-conversions').values(
                'id', 'name', 'platform', 'impressions', 'clicks', 'conversions', 'budget_spent', 'revenue_generated', 'status'
            )[:5]
        )

        overall_roi = 0
        if float(total_spent) > 0:
            overall_roi = round(((float(total_revenue) - float(total_spent)) / float(total_spent)) * 100, 1)

        overall_ctr = 0
        if total_impressions > 0:
            overall_ctr = round((total_clicks / total_impressions) * 100, 2)

        return Response({
            'overview': {
                'total_campaigns': campaigns.count(),
                'active_campaigns': campaigns.filter(status='ACTIVE').count(),
                'total_plans': plans.count(),
                'total_budget': float(total_budget),
                'total_spent': float(total_spent),
                'total_revenue': float(total_revenue),
                'total_impressions': total_impressions,
                'total_clicks': total_clicks,
                'total_conversions': total_conversions,
                'overall_roi': overall_roi,
                'overall_ctr': overall_ctr,
                'total_leads': leads.count(),
                'won_leads': leads.filter(status='WON').count(),
            },
            'platform_distribution': platform_dist,
            'campaign_status': status_dist,
            'lead_pipeline': lead_pipeline,
            'lead_sources': lead_sources,
            'top_campaigns': top_campaigns,
        })
