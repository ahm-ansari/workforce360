from django.urls import path
from .views import HiringPredictionView, ResourceAvailabilityView, AnalysisSummaryView, BusinessLeadAnalysisView

urlpatterns = [
    path('hiring/', HiringPredictionView.as_view(), name='hiring-prediction'),
    path('availability/', ResourceAvailabilityView.as_view(), name='resource-availability'),
    path('leads/', BusinessLeadAnalysisView.as_view(), name='business-leads'),
    path('summary/', AnalysisSummaryView.as_view(), name='analysis-summary'),
]
