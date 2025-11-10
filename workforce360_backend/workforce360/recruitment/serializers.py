# recruitment/serializers.py
from rest_framework import serializers
from .models import RecruitmentPlan, JobOpening, Applicant, JobApplication, Screening, InterviewFeedback, Employee, Document

from django.contrib.contenttypes.models import ContentType

class RecruitmentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentPlan
        fields = '__all__'
        read_only_fields = ('id','created_at','created_by')

class JobOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpening
        fields = '__all__'

class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = '__all__'
        read_only_fields = ('id','created_at')

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant = ApplicantSerializer()
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ('id','applied_at',)

    def create(self, validated_data):
        applicant_data = validated_data.pop('applicant')
        email = applicant_data.get('email')
        # create or update applicant
        applicant, created = Applicant.objects.get_or_create(email=email, defaults=applicant_data)
        if not created:
            # update other applicant fields optionally
            Applicant.objects.filter(pk=applicant.pk).update(**{k:v for k,v in applicant_data.items() if k not in ('id','email')})
            applicant.refresh_from_db()
        validated_data['applicant'] = applicant
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # support nested applicant updates
        applicant_data = validated_data.pop('applicant', None)
        if applicant_data:
            ApplicantSerializer().update(instance.applicant, applicant_data)
        return super().update(instance, validated_data)

class ScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening
        fields = '__all__'
        read_only_fields = ('id','created_at')

class InterviewFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewFeedback
        fields = '__all__'
        read_only_fields = ('id','created_at')

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ('id','created_at')

class DocumentSerializer(serializers.ModelSerializer):
    content_type = serializers.CharField(write_only=True, required=True)
    object_id = serializers.UUIDField(write_only=True, required=True)
    class Meta:
        model = Document
        fields = ('id', 'content_type', 'object_id', 'doc_type', 'file', 'uploaded_by', 'uploaded_at', 'metadata')
        read_only_fields = ('id', 'uploaded_at', 'uploaded_by')

    def create(self, validated_data):
        ct_string = validated_data.pop('content_type')
        object_id = validated_data.pop('object_id')
        try:
            app_label, model = ct_string.split('.')
            content_type = ContentType.objects.get(app_label=app_label, model=model)
        except Exception:
            raise serializers.ValidationError({'content_type': 'Invalid content_type format. Use "app_label.modelname"'})
        validated_data['content_type'] = content_type
        validated_data['object_id'] = object_id
        # set uploaded_by from request if available
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)
