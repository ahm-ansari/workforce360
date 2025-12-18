from rest_framework import serializers
from .models import MarketingAnalysis, MarketingStrategy, MarketingPlan, MarketingCampaign

class MarketingCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingCampaign
        fields = '__all__'

class MarketingPlanSerializer(serializers.ModelSerializer):
    campaigns = MarketingCampaignSerializer(many=True, read_only=True)
    strategy_name = serializers.ReadOnlyField(source='strategy.title')

    class Meta:
        model = MarketingPlan
        fields = '__all__'

class MarketingStrategySerializer(serializers.ModelSerializer):
    plans = MarketingPlanSerializer(many=True, read_only=True)
    analysis_name = serializers.ReadOnlyField(source='analysis.title')

    class Meta:
        model = MarketingStrategy
        fields = '__all__'

class MarketingAnalysisSerializer(serializers.ModelSerializer):
    strategies = MarketingStrategySerializer(many=True, read_only=True)
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')

    class Meta:
        model = MarketingAnalysis
        fields = '__all__'
