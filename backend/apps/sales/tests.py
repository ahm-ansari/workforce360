from django.test import TestCase
from django.utils import timezone
from apps.clients.models import Client
from apps.sales.models import Quotation, QuotationItem, Invoice, Payment
from decimal import Decimal

class SalesModuleTests(TestCase):
    def setUp(self):
        self.client = Client.objects.create(
            name="Test Client",
            client_type="ENTERPRISE",
            status="ACTIVE"
        )

    def test_quotation_item_total_calculation(self):
        quotation = Quotation.objects.create(
            client=self.client,
            quotation_number="QUO-001",
            date=timezone.now().date(),
            expiry_date=timezone.now().date() + timezone.timedelta(days=30),
            subtotal=Decimal("1000.00"),
            total_amount=Decimal("1180.00")
        )
        item = QuotationItem.objects.create(
            quotation=quotation,
            description="Service A",
            quantity=Decimal("2.00"),
            unit_price=Decimal("500.00")
        )
        self.assertEqual(item.total, Decimal("1000.00"))

    def test_invoice_payment_updates_status(self):
        invoice = Invoice.objects.create(
            client=self.client,
            invoice_number="INV-001",
            issue_date=timezone.now().date(),
            due_date=timezone.now().date() + timezone.timedelta(days=15),
            subtotal=Decimal("1000.00"),
            tax_amount=Decimal("180.00"),
            total_amount=Decimal("1180.00"),
            status="UNPAID"
        )

        # Partial Payment
        Payment.objects.create(
            invoice=invoice,
            date=timezone.now().date(),
            amount=Decimal("500.00"),
            payment_mode="BANK_TRANSFER"
        )
        invoice.refresh_from_db()
        self.assertEqual(invoice.amount_paid, Decimal("500.00"))
        self.assertEqual(invoice.status, "PARTIALLY_PAID")

        # Full Payment
        Payment.objects.create(
            invoice=invoice,
            date=timezone.now().date(),
            amount=Decimal("680.00"),
            payment_mode="CASH"
        )
        invoice.refresh_from_db()
        self.assertEqual(invoice.amount_paid, Decimal("1180.00"))
        self.assertEqual(invoice.status, "PAID")
