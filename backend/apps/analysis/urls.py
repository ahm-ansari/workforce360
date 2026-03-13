from django.urls import path
from .views import HiringPredictionView, ResourceAvailabilityView, AnalysisSummaryView, BusinessLeadAnalysisView, MarketAnalysisView, ProjectRiskView, FinancePredictionView

urlpatterns = [
    path('hiring/', HiringPredictionView.as_view(), name='hiring-prediction'),
    path('availability/', ResourceAvailabilityView.as_view(), name='resource-availability'),
    path('leads/', BusinessLeadAnalysisView.as_view(), name='business-leads'),
    path('market/', MarketAnalysisView.as_view(), name='market-analysis'),
    path('projects/risk/', ProjectRiskView.as_view(), name='project-risk'),
    path('finance/cashflow/', FinancePredictionView.as_view(), name='finance-cashflow'),
    path('summary/', AnalysisSummaryView.as_view(), name='analysis-summary'),
]
