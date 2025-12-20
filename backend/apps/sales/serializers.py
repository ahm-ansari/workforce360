from rest_framework import serializers
from .models import Quotation, QuotationItem, WorkOrder, Invoice, InvoiceItem, Payment
from apps.clients.serializers import ClientSerializer

class QuotationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationItem
        fields = '__all__'

class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, required=False)
    client_details = ClientSerializer(source='client', read_only=True)
    created_by_name = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Quotation
        fields = '__all__'

    def create(self, validated_data):
        items_data = self.context.get('view').request.data.get('items', [])
        quotation = Quotation.objects.create(**validated_data)
        for item_data in items_data:
            QuotationItem.objects.create(quotation=quotation, **item_data)
        return quotation

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

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, required=False)
    payments = PaymentSerializer(many=True, read_only=True)
    client_name = serializers.ReadOnlyField(source='client.name')
    balance_due = serializers.ReadOnlyField()

    class Meta:
        model = Invoice
        fields = '__all__'

    def create(self, validated_data):
        items_data = self.context.get('view').request.data.get('items', [])
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        return invoice
