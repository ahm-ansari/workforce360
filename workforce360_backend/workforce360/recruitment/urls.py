from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'recruitment-plans', views.RecruitmentPlanViewSet, basename='recruitmentplan')
router.register(r'jobs', views.JobOpeningViewSet, basename='jobopening')
router.register(r'applicants', views.ApplicantViewSet, basename='applicant')
router.register(r'applications', views.JobApplicationViewSet, basename='application')
router.register(r'screenings', views.ScreeningViewSet, basename='screening')
router.register(r'interviews', views.InterviewFeedbackViewSet, basename='interviewfeedback')
router.register(r'employees', views.EmployeeViewSet, basename='employee')
router.register(r'documents', views.DocumentViewSet, basename='document')

urlpatterns = router.urls
