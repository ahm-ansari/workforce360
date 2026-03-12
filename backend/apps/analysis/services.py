import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from django.db.models import Count, Avg, F
from apps.recruitment.models import Candidate, Job, HiringStage
from apps.employees.models import Employee
from apps.tasks.models import Task
from apps.sales.models import Quotation, WorkOrder, Invoice
from apps.clients.models import Client
from django.utils import timezone
from datetime import timedelta

class HiringAnalysisService:
    @staticmethod
    def get_hiring_stats():
        """Returns statistics for recruitment analysis"""
        total_candidates = Candidate.objects.count()
        candidates_by_status = list(Candidate.objects.values('status').annotate(count=Count('id')))
        candidates_by_source = list(Candidate.objects.values('source').annotate(count=Count('id')))
        
        # Calculate conversion rate (Applied to Hired)
        hired_count = Candidate.objects.filter(status='HIRED').count()
        conversion_rate = (hired_count / total_candidates * 100) if total_candidates > 0 else 0
        
        return {
            'total_candidates': total_candidates,
            'by_status': candidates_by_status,
            'by_source': candidates_by_source,
            'conversion_rate': conversion_rate
        }

    @staticmethod
    def predict_time_to_fill(job_id):
        """
        Simple ML model to predict time to fill for a job position.
        Uses Job Category, Experience Level, and Remote Option as features.
        """
        jobs = Job.objects.filter(status='CLOSED').values(
            'job_category__name', 'experience_level', 'remote_option', 'posted_date', 'closing_date'
        )
        
        if len(jobs) < 5:  # Not enough data for a real model, return average or static estimate
            return 30  # Default 30 days
            
        df = pd.DataFrame(list(jobs))
        df['time_to_fill'] = (df['closing_date'] - df['posted_date']).dt.days
        
        # Preprocessing
        le = LabelEncoder()
        df['cat_encoded'] = le.fit_transform(df['job_category__name'].fillna('Unknown'))
        df['exp_encoded'] = le.fit_transform(df['experience_level'])
        df['remote_encoded'] = df['remote_option'].astype(int)
        
        X = df[['cat_encoded', 'exp_encoded', 'remote_encoded']]
        y = df['time_to_fill']
        
        model = RandomForestRegressor(n_estimators=100)
        model.fit(X, y)
        
        # Predict for current job
        current_job = Job.objects.get(id=job_id)
        current_data = pd.DataFrame([{
            'cat_encoded': le.transform([current_job.job_category.name if current_job.job_category else 'Unknown'])[0],
            'exp_encoded': le.transform([current_job.experience_level])[0],
            'remote_encoded': int(current_job.remote_option)
        }])
        
        prediction = model.predict(current_data)[0]
        return round(prediction, 1)

class ResourceAnalysisService:
    @staticmethod
    def predict_availability():
        """
        Predicts availability of employees based on their current workload.
        """
        employees = Employee.objects.all()
        availability_data = []
        
        for employee in employees:
            total_tasks = Task.objects.filter(assigned_to=employee).count()
            active_tasks = Task.objects.filter(assigned_to=employee, status__in=['TODO', 'IN_PROGRESS']).count()
            
            # Simple heuristic for availability score (0 to 100)
            # Max capacity assumed to be 5 active tasks
            max_capacity = 5
            load = min(active_tasks / max_capacity, 1.0)
            availability_score = round((1.0 - load) * 100, 1)
            
            availability_data.append({
                'employee_id': employee.id,
                'name': f"{employee.user.first_name} {employee.user.last_name}" if employee.user.first_name else employee.user.username,
                'availability_score': availability_score,
                'active_tasks': active_tasks,
                'department': employee.department.name if employee.department else 'Unknown'
            })
            
        return availability_data

    @staticmethod
    def get_resource_forecast():
        """
        Forecasts resource demand for the next 4 weeks.
        Currently uses a simple exponential moving average of task creation.
        """
        # Get tasks created in the last 12 weeks
        twelve_weeks_ago = timezone.now() - timedelta(weeks=12)
        tasks = Task.objects.filter(created_at__gte=twelve_weeks_ago).values('created_at')
        
        if not tasks:
            return [10, 10, 10, 10] # Default forecast
            
        df = pd.DataFrame(list(tasks))
        df['week'] = df['created_at'].dt.isocalendar().week
        weekly_counts = df.groupby('week').size().tolist()
        
        # Simple forecast: average of last few weeks
        if len(weekly_counts) == 0:
            return [0, 0, 0, 0]
            
        avg_demand = sum(weekly_counts) / len(weekly_counts)
        return [round(avg_demand * (1 + (i*0.05)), 1) for i in range(1, 5)] # Slight growth trend

class BusinessLeadAnalysisService:
    @staticmethod
    def get_lead_stats():
        """Returns statistics for business leads (Prospects/Negotiations)"""
        prospects = Client.objects.filter(status__in=['PROSPECT', 'NEGOTIATION'])
        total_leads = prospects.count()
        leads_by_industry = list(prospects.values('industry').annotate(count=Count('id')))
        leads_by_type = list(prospects.values('client_type').annotate(count=Count('id')))
        
        # Lead Pipeline Value (Based on Quotations)
        pipeline_value = Quotation.objects.filter(
            client__status__in=['PROSPECT', 'NEGOTIATION'],
            status__in=['DRAFT', 'SENT']
        ).aggregate(total=models.Sum('total_amount'))['total'] or 0
        
        return {
            'total_leads': total_leads,
            'by_industry': leads_by_industry,
            'by_type': leads_by_type,
            'pipeline_value': float(pipeline_value)
        }

    @staticmethod
    def predict_lead_conversion(client_id):
        """
        Uses historical data to predict the likelihood of a lead converting to an ACTIVE client.
        Factors: Industry, Client Type, Number of Quotations, Total Quotation Value.
        """
        # Training data: Clients that became ACTIVE
        historical_clients = Client.objects.filter(status='ACTIVE').values('industry', 'client_type', 'id')
        
        if len(historical_clients) < 5:
            return 65.0 # Default confidence
            
        data = []
        for hc in historical_clients:
            q_stats = Quotation.objects.filter(client_id=hc['id']).aggregate(
                count=Count('id'), 
                val=models.Sum('total_amount')
            )
            data.append({
                'industry': hc['industry'] or 'Unknown',
                'type': hc['client_type'],
                'q_count': q_stats['count'] or 0,
                'q_val': float(q_stats['val'] or 0),
                'converted': 1
            })
            
        # Add some failed ones if possible (INACTIVE)
        inactive_clients = Client.objects.filter(status='INACTIVE').values('industry', 'client_type', 'id')
        for ic in inactive_clients:
            q_stats = Quotation.objects.filter(client_id=ic['id']).aggregate(
                count=Count('id'), 
                val=models.Sum('total_amount')
            )
            data.append({
                'industry': ic['industry'] or 'Unknown',
                'type': ic['client_type'],
                'q_count': q_stats['count'] or 0,
                'q_val': float(q_stats['val'] or 0),
                'converted': 0
            })
            
        df = pd.DataFrame(data)
        
        le_ind = LabelEncoder()
        df['ind_enc'] = le_ind.fit_transform(df['industry'])
        le_typ = LabelEncoder()
        df['typ_enc'] = le_typ.fit_transform(df['type'])
        
        X = df[['ind_enc', 'typ_enc', 'q_count', 'q_val']]
        y = df['converted']
        
        model = RandomForestClassifier(n_estimators=100)
        model.fit(X, y)
        
        # Predict for current client
        target = Client.objects.get(id=client_id)
        t_q_stats = Quotation.objects.filter(client_id=client_id).aggregate(
            count=Count('id'), 
            val=models.Sum('total_amount')
        )
        
        # Handle unseen labels
        try:
            target_ind = le_ind.transform([target.industry or 'Unknown'])[0]
        except:
            target_ind = -1
            
        target_data = pd.DataFrame([{
            'ind_enc': target_ind,
            'typ_enc': le_typ.transform([target.client_type])[0],
            'q_count': t_q_stats['count'] or 0,
            'q_val': float(t_q_stats['val'] or 0)
        }])
        
        prob = model.predict_proba(target_data)[0][1] # Probability of class 1 (Converted)
        return round(prob * 100, 1)
