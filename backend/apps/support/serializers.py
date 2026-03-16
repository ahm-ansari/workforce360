from rest_framework import serializers
from .models import TicketCategory, SupportTicket, TicketMessage
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

class SupportTicketSerializer(serializers.ModelSerializer):
    user_details = UserSimpleSerializer(source='user', read_only=True)
    assigned_to_details = UserSimpleSerializer(source='assigned_to', read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    message_count = serializers.IntegerField(source='messages.count', read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_id', 'user', 'user_details', 'category', 'category_name',
            'title', 'description', 'status', 'priority', 'assigned_to', 
            'assigned_to_details', 'message_count', 'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['ticket_id', 'user', 'created_at', 'updated_at', 'resolved_at']

class SupportTicketDetailSerializer(SupportTicketSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)

    class Meta(SupportTicketSerializer.Meta):
        fields = SupportTicketSerializer.Meta.fields + ['messages']
