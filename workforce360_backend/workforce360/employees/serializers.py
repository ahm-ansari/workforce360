# employees/serializers.py
from rest_framework import serializers
from .models import Employee, Employee_Payroll, Employee_Attendance, Employee_Leave, EmployeeDemoGraphics, EmployeeKPI
from person.models import Person, Phone, Email, Post_Address, Demographics, Education, Experience, Skills, Certificates, Languages, Interests, Hobbies, Achievements, Awards



class PersonSerializer(serializers.Serializer):
    class Meta:
        model = Person
        fields = '__all__'

class PhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phone
        fields = '__all__'

class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post_Address
        fields = '__all__'

class DemographicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Demographics
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class ExperianceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = '__all__'

class CerificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificates
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = '__all__'

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interests
        fields = '__all__'

class HobbiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hobbies
        fields = '__all__'

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievements
        fields = '__all__'

class AwardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Awards
        fields = '__all__'

class EmployeeKPISerializer(serializers.ModelSerializer):
    overall_score = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeKPI
        fields = ['attendance_rate', 'task_completion_rate', 'performance_index', 'overall_score', 'last_updated']

    def get_overall_score(self, obj):
        return obj.calculate_overall_score()
    

class EmployeeSerializer(serializers.Serializer):
    # Change 'source' to match the actual key names in the 'values()' dictionary output
    first_name = serializers.CharField(source='person__first_name')
    last_name = serializers.CharField(source='person__last_name')
    date_of_birth = serializers.DateField(source='person__date_of_birth')
    gender = serializers.CharField(source='person__gender')
    
    # These fields are direct attributes of the Employee model/dictionary
    emp_code = serializers.CharField()
    status = serializers.CharField()
    dataofjoining = serializers.DateField()
    dataofleaving = serializers.DateField(allow_null=True)
    is_blocked = serializers.BooleanField()
    reporting_manager_id = serializers.IntegerField(allow_null=True)
    performance_score = serializers.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    manager_name = serializers.CharField(allow_null=True) # The annotated field
    
    kpis = EmployeeKPISerializer(read_only=True)
    tenure_days = serializers.SerializerMethodField()

    def get_tenure_days(self, obj):
        return obj.tenure_days
    
class Employee_PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Payroll
        fields = '__all__'

class Employee_AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Attendance
        fields = '__all__'

class Employee_LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Leave
        fields = '__all__'

class EmployeeDemographicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDemoGraphics
        fields = '__all__'
