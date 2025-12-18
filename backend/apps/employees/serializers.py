from rest_framework import serializers
from .models import Department, Designation, Employee
from apps.users.serializers import UserSerializer

class DepartmentSerializer(serializers.ModelSerializer):
    designations_count = serializers.SerializerMethodField()
    employees_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'created_at', 'designations_count', 'employees_count']
        read_only_fields = ['created_at']
    
    def get_designations_count(self, obj):
        return obj.designations.count()
    
    def get_employees_count(self, obj):
        return obj.employee_set.count()

class DesignationSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(source='department', read_only=True)
    
    class Meta:
        model = Designation
        fields = ['id', 'name', 'department', 'department_details', 'description']

class EmployeeSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)
    designation_details = DesignationSerializer(source='designation', read_only=True)

    # Writable fields for user update (manual handling)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True, required=False)
    role = serializers.IntegerField(required=False)

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'user', 'user_details', 'department', 'department_details',
            'designation', 'designation_details', 'date_of_joining',
            'address', 'emergency_contact', 'full_name',
            'first_name', 'last_name', 'email', 'password', 'role'
        ]
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def get_full_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return f"Employee #{obj.id}"

    def update(self, instance, validated_data):
        # Extract manual fields
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        email = validated_data.pop('email', None)
        password = validated_data.pop('password', None)
        role_id = validated_data.pop('role', None)
        
        # Update User fields
        user = instance.user
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if email is not None:
            user.email = email
        if password:
            user.set_password(password)
        
        if role_id:
            from apps.users.models import Role
            try:
                user.role = Role.objects.get(id=role_id)
            except Role.DoesNotExist:
                pass

        user.save()
            
        # Update Employee fields
        return super().update(instance, validated_data)

class EmployeeCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating employees with user data"""
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    role = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Employee
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name', 'role',
            'department', 'designation', 'date_of_joining',
            'address', 'emergency_contact'
        ]
    
    def create(self, validated_data):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Extract user data
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        role_id = validated_data.pop('role', None)
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Set role if provided
        if role_id:
            from apps.users.models import Role
            try:
                role = Role.objects.get(id=role_id)
                user.role = role
                user.save()
            except Role.DoesNotExist:
                pass
        
        # Create employee profile
        employee = Employee.objects.create(user=user, **validated_data)
        return employee
