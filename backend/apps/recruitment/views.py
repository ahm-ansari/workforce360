from django.conf import settings
import google.generativeai as genai
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Count, Q
from .models import Job, Candidate, Interview, HiringStage, CandidateStageHistory, JobCategory
from .serializers import (
    JobSerializer, CandidateSerializer, InterviewSerializer,
    HiringStageSerializer, CandidateStageHistorySerializer, JobCategorySerializer,
    PublicJobSerializer, CandidateApplicationSerializer
)

class JobCategoryViewSet(viewsets.ModelViewSet):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    permission_classes = [IsAuthenticated]

class HiringStageViewSet(viewsets.ModelViewSet):
    queryset = HiringStage.objects.all()
    serializer_class = HiringStageSerializer
    permission_classes = [IsAuthenticated]

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related('department', 'job_category', 'posted_by').all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish a job posting"""
        job = self.get_object()
        job.status = 'PUBLISHED'
        job.posted_date = timezone.now().date()
        job.save()
        return Response({'status': 'job published'})
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close a job posting"""
        job = self.get_object()
        job.status = 'CLOSED'
        job.save()
        return Response({'status': 'job closed'})
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """List all published jobs (public endpoint)"""
        jobs = Job.objects.filter(status='PUBLISHED').select_related('department', 'job_category')
        serializer = PublicJobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny], url_path='public-detail')
    def public_detail(self, request, pk=None):
        """Get job details (public endpoint)"""
        try:
            job = Job.objects.filter(status='PUBLISHED', pk=pk).select_related('department', 'job_category').first()
            if not job:
                return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = PublicJobSerializer(job)
            return Response(serializer.data)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def generate_description(self, request):
        """Generate job description using Google AI (Gemini)"""
        title = request.data.get('title', '')
        if not title:
            return Response({'error': 'Title is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        api_key = getattr(settings, 'GOOGLE_API_KEY', None)
        if not api_key:
            return Response({'error': 'Google API Key not configured'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            prompt = f"""
            Generate a professional job description and requirements list for the job title: "{title}".
            
            Format the output exactly as follows:
            
            DESCRIPTION:
            [Write a compelling job description here, including key responsibilities]
            
            REQUIREMENTS:
            [List key requirements, skills, and qualifications as bullet points]
            """

            response = model.generate_content(prompt)
            content = response.text
            
            # Simple parsing based on the requested format
            description_part = ""
            requirements_part = ""
            
            if "DESCRIPTION:" in content and "REQUIREMENTS:" in content:
                parts = content.split("REQUIREMENTS:")
                description_part = parts[0].replace("DESCRIPTION:", "").strip()
                requirements_part = parts[1].strip()
            else:
                # Fallback if format is not exact
                description_part = content
                requirements_part = "Please review the description for requirements."

            return Response({
                'description': description_part,
                'requirements': requirements_part
            })

        except Exception as e:
            error_msg = str(e)
            print(f"Google AI API Error: {error_msg}")
            
            if "leaked" in error_msg.lower():
                return Response({
                    'error': 'The Google AI API key has been reported as leaked and is blocked. Please update the API key in the configuration.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            return Response({'error': 'Failed to generate description'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get job statistics"""
        stats = {
            'total': Job.objects.count(),
            'published': Job.objects.filter(status='PUBLISHED').count(),
            'draft': Job.objects.filter(status='DRAFT').count(),
            'closed': Job.objects.filter(status='CLOSED').count(),
        }
        return Response(stats)

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.select_related('job', 'current_stage').all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def apply(self, request):
        """Submit a job application (public endpoint)"""
        serializer = CandidateApplicationSerializer(data=request.data)
        if serializer.is_valid():
            # Get the first hiring stage (Application)
            first_stage = HiringStage.objects.filter(is_active=True).order_by('order').first()
            candidate = serializer.save(
                current_stage=first_stage,
                status='APPLIED'
            )
            
            # Create stage history entry
            CandidateStageHistory.objects.create(
                candidate=candidate,
                stage=first_stage,
                notes='Application submitted'
            )
            
            return Response({
                'status': 'application submitted',
                'candidate_id': candidate.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def move_stage(self, request, pk=None):
        """Move candidate to a different hiring stage"""
        candidate = self.get_object()
        stage_id = request.data.get('stage_id')
        notes = request.data.get('notes', '')
        
        try:
            stage = HiringStage.objects.get(id=stage_id)
            candidate.current_stage = stage
            
            # Update status based on stage name
            stage_name_lower = stage.name.lower()
            if 'hired' in stage_name_lower:
                candidate.status = 'HIRED'
            elif 'offer' in stage_name_lower:
                candidate.status = 'OFFERED'
            elif 'interview' in stage_name_lower:
                candidate.status = 'INTERVIEW'
            elif 'screening' in stage_name_lower:
                candidate.status = 'SCREENING'
            
            candidate.save()
            
            # Create history entry
            CandidateStageHistory.objects.create(
                candidate=candidate,
                stage=stage,
                moved_by=request.user,
                notes=notes
            )
            
            return Response({'status': 'candidate moved to new stage'})
        except HiringStage.DoesNotExist:
            return Response({'error': 'Stage not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate a candidate"""
        candidate = self.get_object()
        rating = request.data.get('rating')
        notes = request.data.get('notes', '')
        
        if rating and 1 <= int(rating) <= 5:
            candidate.rating = rating
            if notes:
                candidate.notes = notes
            candidate.save()
            return Response({'status': 'candidate rated'})
        return Response({'error': 'Invalid rating'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a candidate"""
        candidate = self.get_object()
        notes = request.data.get('notes', '')
        
        candidate.status = 'REJECTED'
        if notes:
            candidate.notes = notes
        candidate.save()
        
        return Response({'status': 'candidate rejected'})
    
    @action(detail=False, methods=['get'])
    def pipeline(self, request):
        """Get candidates grouped by hiring stage for Kanban view"""
        stages = HiringStage.objects.filter(is_active=True).order_by('order')
        pipeline_data = []
        
        for stage in stages:
            candidates = Candidate.objects.filter(current_stage=stage).select_related('job')
            pipeline_data.append({
                'stage': HiringStageSerializer(stage).data,
                'candidates': CandidateSerializer(candidates, many=True).data
            })
        
        return Response(pipeline_data)

class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.select_related('candidate', 'interviewer').all()
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark interview as completed and add feedback"""
        interview = self.get_object()
        interview.status = 'COMPLETED'
        interview.feedback = request.data.get('feedback', '')
        interview.rating = request.data.get('rating')
        interview.recommendation = request.data.get('recommendation', '')
        interview.save()
        
        return Response({'status': 'interview completed'})
    
    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """Reschedule an interview"""
        interview = self.get_object()
        interview.status = 'RESCHEDULED'
        interview.scheduled_date = request.data.get('scheduled_date')
        interview.scheduled_time = request.data.get('scheduled_time')
        interview.save()
        
        return Response({'status': 'interview rescheduled'})
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming interviews"""
        upcoming = Interview.objects.filter(
            status='SCHEDULED',
            scheduled_date__gte=timezone.now().date()
        ).select_related('candidate', 'interviewer').order_by('scheduled_date', 'scheduled_time')
        
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)

class CandidateStageHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CandidateStageHistory.objects.select_related('candidate', 'stage', 'moved_by').all()
    serializer_class = CandidateStageHistorySerializer
    permission_classes = [IsAuthenticated]
