from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from .models import (
    RecruitmentPlan, JobOpening, Applicant, JobApplication,
    Screening, InterviewFeedback, Employee, Document
)
from .serializers import (
    RecruitmentPlanSerializer, JobOpeningSerializer, ApplicantSerializer,
    JobApplicationSerializer, ScreeningSerializer, InterviewFeedbackSerializer,
    EmployeeSerializer, DocumentSerializer
)

class RecruitmentPlanViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentPlan.objects.all().order_by('-created_at')
    serializer_class = RecruitmentPlanSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'department', 'notes']
    ordering_fields = ['open_date', 'close_date', 'created_at']

    def perform_create(self, serializer):
        user = getattr(self.request, 'user', None)
        if user and user.is_authenticated:
            serializer.save(created_by=user)
        else:
            serializer.save()

class JobOpeningViewSet(viewsets.ModelViewSet):
    queryset = JobOpening.objects.select_related('plan', 'hiring_manager').all()
    serializer_class = JobOpeningSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'job_code', 'location', 'description']
    ordering_fields = ['created_at', 'title']

class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone']

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.select_related('applicant', 'job').all()
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['applicant__first_name', 'applicant__last_name', 'applicant__email', 'job__title', 'status']
    ordering_fields = ['applied_at']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def change_status(self, request, pk=None):
        app = self.get_object()
        status_value = request.data.get('status')
        if not status_value:
            return Response({'detail': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)
        allowed = dict(JobApplication.STATUS)
        if status_value not in allowed:
            return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        app.status = status_value
        app.save()
        return Response(self.get_serializer(app).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def hire(self, request, pk=None):
        """
        Convert an application into an Employee record.
        Request body: { "start_date": "YYYY-MM-DD", "position": "Title (optional)" }
        """
        app = self.get_object()
        if app.status not in ('offered', 'interview'):
            return Response({'detail': 'Only candidates in offered/interview can be hired'}, status=status.HTTP_400_BAD_REQUEST)
        if hasattr(app, 'employee') and app.employee is not None:
            return Response({'detail': 'Employee already exists for this application'}, status=status.HTTP_400_BAD_REQUEST)
        start_date = request.data.get('start_date')
        position = request.data.get('position', app.job.title if app.job else '')
        employee_code = f"EMP-{str(app.id)[:8]}"
        emp_data = {
            'application': app.id,
            'employee_code': employee_code,
            'first_name': app.applicant.first_name,
            'last_name': app.applicant.last_name,
            'email': app.applicant.email,
            'position': position,
            'start_date': start_date
        }
        serializer = EmployeeSerializer(data=emp_data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()
        app.status = 'hired'
        app.save()
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_201_CREATED)

class ScreeningViewSet(viewsets.ModelViewSet):
    queryset = Screening.objects.select_related('screener', 'application').all()
    serializer_class = ScreeningSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']

class InterviewFeedbackViewSet(viewsets.ModelViewSet):
    queryset = InterviewFeedback.objects.select_related('interviewer', 'application').all()
    serializer_class = InterviewFeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee_code', 'first_name', 'last_name', 'email']

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['uploaded_at']

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx
