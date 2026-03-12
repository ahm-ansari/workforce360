from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import HiringAnalysisService, ResourceAnalysisService, BusinessLeadAnalysisService

class HiringPredictionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Returns hiring predictions and stats for recruitment analysis.
        """
        stats = HiringAnalysisService.get_hiring_stats()
        
        # Predict for newest closed job as an example
        from apps.recruitment.models import Job
        last_job = Job.objects.first()
        time_to_fill_prediction = 30
        if last_job:
            try:
                time_to_fill_prediction = HiringAnalysisService.predict_time_to_fill(last_job.id)
            except Exception as e:
                print(f"Prediction Error: {e}")
                
        return Response({
            'stats': stats,
            'prediction': {
                'job_id': last_job.id if last_job else None,
                'job_title': last_job.title if last_job else 'None',
                'predicted_time_to_fill_days': time_to_fill_prediction
            }
        })

class ResourceAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Returns employee availability predictions.
        """
        availability = ResourceAnalysisService.predict_availability()
        forecast = ResourceAnalysisService.get_resource_forecast()
        
        return Response({
            'availability_data': availability,
            'demand_forecast': forecast
        })

class BusinessLeadAnalysisView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Returns lead analytics and conversion probability.
        """
        stats = BusinessLeadAnalysisService.get_lead_stats()
        
        # Predict for newest prospect
        from apps.clients.models import Client
        lead = Client.objects.filter(status__in=['PROSPECT', 'NEGOTIATION']).first()
        prediction = 0
        if lead:
            try:
                prediction = BusinessLeadAnalysisService.predict_lead_conversion(lead.id)
            except Exception as e:
                print(f"Lead Prediction Error: {e}")
                
        return Response({
            'stats': stats,
            'prediction': {
                'client_id': lead.id if lead else None,
                'client_name': lead.name if lead else 'N/A',
                'conversion_probability': prediction
            }
        })

class AnalysisSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Home for overall analysis across modules.
        """
        # Aggregate statistics
        from apps.recruitment.models import Candidate
        from apps.employees.models import Employee
        from apps.tasks.models import Task
        
        return Response({
            'counts': {
                'candidates': Candidate.objects.count(),
                'employees': Employee.objects.count(),
                'active_tasks': Task.objects.filter(status__in=['TODO', 'IN_PROGRESS']).count()
            },
            'labels': ['Candidates', 'Employees', 'Active Tasks'],
            'data': [Candidate.objects.count(), Employee.objects.count(), Task.objects.filter(status__in=['TODO', 'IN_PROGRESS']).count()]
        })
