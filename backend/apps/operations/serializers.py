from rest_framework import serializers
from .models import Deployment
from apps.employees.serializers import EmployeeSerializer
from apps.clients.serializers import ClientSerializer

class DeploymentSerializer(serializers.ModelSerializer):
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    client_name = serializers.ReadOnlyField(source='client.name')
    site_name = serializers.ReadOnlyField(source='site.site_name')

    class Meta:
        model = Deployment
        fields = '__all__'
