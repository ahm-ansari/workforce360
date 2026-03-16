from rest_framework import serializers
from .models import TicketCategory, SupportTicket, TicketMessage, EscalationMatrix
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_picture']

class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = '__all__'

class TicketMessageSerializer(serializers.ModelSerializer):
    user_details = UserSimpleSerializer(source='user', read_only=True)
    
    class Meta:
        model = TicketMessage
        fields = ['id', 'ticket', 'user', 'user_details', 'message', 'attachment', 'is_internal', 'created_at']
        read_only_fields = ['user', 'created_at']

class EscalationMatrixSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    
    class Meta:
        model = EscalationMatrix
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    user_details = UserSimpleSerializer(source='user', read_only=True)
    assigned_to_details = UserSimpleSerializer(source='assigned_to', read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    department_name = serializers.ReadOnlyField(source='department.name')
    message_count = serializers.IntegerField(source='messages.count', read_only=True)
    
    facility_name = serializers.ReadOnlyField(source='facility.name')
    space_name = serializers.ReadOnlyField(source='space.name')
    asset_name = serializers.ReadOnlyField(source='asset.name')
    
    response_time_seconds = serializers.SerializerMethodField()
    resolution_time_seconds = serializers.SerializerMethodField()
    time_to_assign_seconds = serializers.SerializerMethodField()
    time_to_resolve_after_assignment_seconds = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_id', 'user', 'user_details', 'category', 'category_name',
            'department', 'department_name',
            'title', 'description', 'status', 'priority', 'assigned_to', 
            'assigned_to_details', 'facility', 'facility_name', 'space', 'space_name',
            'asset', 'asset_name', 'message_count', 'created_at', 'updated_at', 'assigned_at',
            'first_response_at', 'resolved_at', 'sla_deadline',
            'response_time_seconds', 'resolution_time_seconds',
            'time_to_assign_seconds', 'time_to_resolve_after_assignment_seconds'
        ]
        read_only_fields = ['ticket_id', 'user', 'created_at', 'updated_at', 'assigned_at', 'first_response_at', 'resolved_at']

    def get_response_time_seconds(self, obj):
        return obj.response_time.total_seconds() if obj.response_time else None

    def get_resolution_time_seconds(self, obj):
        return obj.resolution_time.total_seconds() if obj.resolution_time else None

    def get_time_to_assign_seconds(self, obj):
        return obj.time_to_assign.total_seconds() if obj.time_to_assign else None

    def get_time_to_resolve_after_assignment_seconds(self, obj):
        return obj.time_to_resolve_after_assignment.total_seconds() if obj.time_to_resolve_after_assignment else None

class SupportTicketDetailSerializer(SupportTicketSerializer):
    messages = serializers.SerializerMethodField()

    class Meta(SupportTicketSerializer.Meta):
        fields = SupportTicketSerializer.Meta.fields + ['messages']

    def get_messages(self, obj):
        request = self.context.get('request')
        messages = obj.messages.all().order_by('created_at')
        
        # If user is not staff, hide internal messages
        if request and not request.user.is_staff:
            messages = messages.filter(is_internal=False)
            
        return TicketMessageSerializer(messages, many=True).data
