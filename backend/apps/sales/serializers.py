from rest_framework import serializers
from .models import Quotation, QuotationItem, WorkOrder, Invoice, InvoiceItem
from apps.clients.serializers import ClientSerializer

class QuotationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationItem
        fields = '__all__'

class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    client_details = ClientSerializer(source='client', read_only=True)

    class Meta:
        model = Quotation
        fields = '__all__'

class WorkOrderSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.name')
    quotation_number = serializers.ReadOnlyField(source='quotation.quotation_number')

    class Meta:
        model = WorkOrder
        fields = '__all__'

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    client_name = serializers.ReadOnlyField(source='client.name')

    class Meta:
        model = Invoice
        fields = '__all__'
