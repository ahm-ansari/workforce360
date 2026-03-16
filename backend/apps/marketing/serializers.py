from rest_framework import serializers
from .models import MarketingAnalysis, MarketingStrategy, MarketingPlan, MarketingCampaign, MarketingLead
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class MarketingLeadSerializer(serializers.ModelSerializer):
    assigned_to_details = UserSimpleSerializer(source='assigned_to', read_only=True)
    campaign_name = serializers.ReadOnlyField(source='campaign.name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    source_display = serializers.CharField(source='get_source_display', read_only=True)

    class Meta:
        model = MarketingLead
        fields = '__all__'

class MarketingCampaignSerializer(serializers.ModelSerializer):
    ctr = serializers.ReadOnlyField()
    cpc = serializers.ReadOnlyField()
    roi = serializers.ReadOnlyField()
    leads_count = serializers.IntegerField(source='leads.count', read_only=True)
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = MarketingCampaign
        fields = '__all__'

class MarketingPlanSerializer(serializers.ModelSerializer):
    campaigns = MarketingCampaignSerializer(many=True, read_only=True)
    strategy_name = serializers.ReadOnlyField(source='strategy.title')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    total_campaigns = serializers.IntegerField(source='campaigns.count', read_only=True)

    class Meta:
        model = MarketingPlan
        fields = '__all__'

class MarketingStrategySerializer(serializers.ModelSerializer):
    plans = MarketingPlanSerializer(many=True, read_only=True)
    analysis_name = serializers.ReadOnlyField(source='analysis.title')
    total_plans = serializers.IntegerField(source='plans.count', read_only=True)

    class Meta:
        model = MarketingStrategy
        fields = '__all__'

class MarketingAnalysisSerializer(serializers.ModelSerializer):
    strategies = MarketingStrategySerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()
    total_strategies = serializers.IntegerField(source='strategies.count', read_only=True)

    class Meta:
        model = MarketingAnalysis
        fields = '__all__'

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return None
