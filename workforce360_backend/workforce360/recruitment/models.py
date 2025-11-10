# recruitment/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid
from person.models import Person
from employees.models import Employee

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

User = settings.AUTH_USER_MODEL

def uuid_slug():
    return str(uuid.uuid4())

class Job_role(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    responsibilities = models.TextField()
    qualifications = models.TextField()
    benefits = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class RecruitmentPlan(models.Model):
    STATUS_CHOICES = [
        ('draft','Draft'), ('open','Open'), ('closed','Closed'), ('archived','Archived')
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    positions = models.ForeignKey(Job_role, on_delete=models.SET_NULL, null=True, blank=True)
    open_date = models.DateField()
    close_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='+')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.department})"

class JobOpening(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(RecruitmentPlan, on_delete=models.CASCADE, related_name='jobs')
    job_code = models.CharField(max_length=40, unique=True)
    title = models.CharField(max_length=150)
    location = models.CharField(max_length=100, blank=True)
    hiring_manager = models.ForeignKey(Employee, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(blank=True)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_code} - {self.title}"

class Applicant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.OneToOneField(Person, on_delete=models.CASCADE, related_name='applicant')
    cv = models.FileField(upload_to='applicant_cvs/', null=True, blank=True)
    cover_letter = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"

class JobApplication(models.Model):
    STATUS = [
        ('applied','Applied'),('scrutiny','Under Scrutiny'),('shortlisted','Shortlisted'),
        ('interview','Interviewing'),('offered','Offered'),('hired','Hired'),('rejected','Rejected'),('withdrawn','Withdrawn')
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(JobOpening, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=30, choices=STATUS, default='applied')
    applied_at = models.DateTimeField(default=timezone.now)
    source = models.CharField(max_length=100, blank=True)

    class Meta:
        unique_together = ('applicant','job')

    def __str__(self):
        return f"{self.applicant} -> {self.job} [{self.status}]"

class Screening(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='screenings')
    screener = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    passed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class InterviewFeedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='feedbacks')
    interviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    interview_type = models.CharField(max_length=50, choices=[('phone','Phone'),('onsite','Onsite'),('panel','Panel')], default='onsite')
    date = models.DateField(null=True, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    decision_recommendation = models.CharField(max_length=30, choices=[('progress','Progress'), ('reject','Reject'), ('offer','Offer')], default='progress')
    created_at = models.DateTimeField(auto_now_add=True)

class EmployeeRecruited(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.OneToOneField(JobApplication, on_delete=models.SET_NULL, null=True, blank=True)
    employee_code = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    person = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True, blank=True)
    position = models.ForeignKey(Job_role, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee_code} - {self.first_name} {self.last_name}"

class Document(models.Model):
    OWNER_CHOICES = [('applicant','Applicant'),('employee','Employee'),('other','Other')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner_type = models.CharField(max_length=20, choices=OWNER_CHOICES)
    owner_id = models.UUIDField()  # generic link, you can use django-genericforeignkey if preferred
    doc_type = models.CharField(max_length=80)
    file = models.FileField(upload_to='documents/')
    uploaded_by = models.ForeignKey(Employee, null=True, on_delete=models.SET_NULL)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.doc_type} @ {self.owner_type}:{self.owner_id}"

