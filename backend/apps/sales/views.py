from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Quotation, WorkOrder, Invoice, Payment
from .serializers import QuotationSerializer, WorkOrderSerializer, InvoiceSerializer, PaymentSerializer

class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        quotation = self.get_object()
        if quotation.status == 'ACCEPTED':
            return Response({'detail': 'Quotation already accepted.'}, status=status.HTTP_400_BAD_REQUEST)
        
        quotation.status = 'ACCEPTED'
        quotation.save()
        
        # Automatically create a Work Order
        wo_number = f"WO-{quotation.quotation_number.split('-')[-1]}"
        work_order = WorkOrder.objects.create(
            quotation=quotation,
            client=quotation.client,
            work_order_number=wo_number,
            start_date=quotation.date,
            description=f"Work Order generated from Quotation {quotation.quotation_number}. \n\nNotes: {quotation.notes}",
            total_value=quotation.total_amount
        )
        
        return Response({
            'status': 'Quotation accepted and Work Order created',
            'work_order_id': work_order.id,
            'work_order_number': work_order.work_order_number
        })

class WorkOrderViewSet(viewsets.ModelViewSet):
    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
