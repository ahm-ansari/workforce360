from rest_framework import serializers
from .models import Client, ClientContact, ClientSite
from apps.employees.models import Employee

class EmployeeShortSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    class Meta:
        model = Employee
        fields = ['id', 'full_name']

class ClientContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientContact
        fields = '__all__'

class ClientSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientSite
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    contacts = ClientContactSerializer(many=True, read_only=True)
    sites = ClientSiteSerializer(many=True, read_only=True)
    account_manager_name = serializers.CharField(source='account_manager.user.get_full_name', read_only=True)
    
    class Meta:
        model = Client
        fields = '__all__'

class ClientListSerializer(serializers.ModelSerializer):
    account_manager_name = serializers.CharField(source='account_manager.user.get_full_name', read_only=True)
    contact_count = serializers.IntegerField(source='contacts.count', read_only=True)
    site_count = serializers.IntegerField(source='sites.count', read_only=True)

    class Meta:
        model = Client
        fields = ['id', 'name', 'client_type', 'status', 'email', 'phone', 'industry', 'account_manager_name', 'contact_count', 'site_count']
