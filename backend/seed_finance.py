import os
import django
from datetime import date, datetime, timedelta
import random
from decimal import Decimal

import pymysql
pymysql.install_as_MySQLdb()

# Set up Django
import dotenv
dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.employees.models import Employee
from apps.finance.models import Payroll, Reimbursement, Transaction

def seed_finance_data():
    print("Seeding Finance & Payroll Data...")
    
    employees = Employee.objects.all()
    if not employees.exists():
        print("No employees found. Please run the main seed script first.")
        return

    # 1. Seed Payroll Data
    print("Generating Payroll history...")
    current_year = date.today().year
    current_month = date.today().month
    
    # Last 6 months
    for i in range(1, 7):
        month = current_month - i
        year = current_year
        if month <= 0:
            month += 12
            year -= 1
            
        for emp in employees:
            # Base salary based on designation or random range if not set
            base = Decimal(random.randint(40000, 120000))
            allow = Decimal(random.randint(2000, 8000))
            deduct = Decimal(random.randint(500, 3000))
            
            payroll, created = Payroll.objects.get_or_create(
                employee=emp,
                month=month,
                year=year,
                defaults={
                    'basic_salary': base,
                    'allowances': allow,
                    'deductions': deduct,
                    'status': 'PAID' if i > 1 else random.choice(['PROCESSED', 'PAID'])
                }
            )
            if created:
                payroll.calculate_net()
                payroll.save()

    print(f"Successfully seeded payroll for {employees.count()} employees over 6 months.")

    # 2. Seed Reimbursement Data
    print("Generating Reimbursement requests...")
    reimbursement_descriptions = [
        "Client Lunch - Tech City",
        "Train Ticket to NY",
        "Office Supplies - Stationeries",
        "Internet Bill - Remote Work",
        "Taxi to Airport",
        "Parking Fee - Downtown Hub",
        "Software Subscription - Adobe",
        "Hardware Upgrade - RAM",
        "Project Meeting Refreshments",
        "Professional Certification Fee"
    ]
    
    for _ in range(25):
        emp = random.choice(employees)
        amount = Decimal(random.uniform(50.0, 1500.0)).quantize(Decimal('0.01'))
        desc = random.choice(reimbursement_descriptions)
        status = random.choice(['PENDING', 'APPROVED', 'REJECTED', 'PAID'])
        
        Reimbursement.objects.create(
            employee=emp,
            amount=amount,
            description=desc,
            status=status
        )
    
    print("Successfully seeded 25 reimbursement requests.")

    # 3. Seed Transactions
    print("Generating Financial Transactions...")
    transaction_types = [
        ('INCOME', 'Client Invoice Payment - Proyecto X'),
        ('INCOME', 'Service Fee - Maintenance Contract'),
        ('INCOME', 'Outsourcing Revenue - Q1'),
        ('EXPENSE', 'Office Rent - tech City'),
        ('EXPENSE', 'Electricity Bill'),
        ('EXPENSE', 'Server Hosting Fees'),
        ('EXPENSE', 'Employee Insurance Premium'),
        ('EXPENSE', 'Marketing Campaign - Social Media'),
        ('EXPENSE', 'Recruitment Portal Subscription'),
        ('EXPENSE', 'Security Services')
    ]
    
    for _ in range(40):
        t_type, base_desc = random.choice(transaction_types)
        amount = Decimal(random.uniform(1000.0, 50000.0)).quantize(Decimal('0.01'))
        
        Transaction.objects.create(
            type=t_type,
            amount=amount,
            description=f"{base_desc} (Ref: {random.randint(10000, 99999)})"
        )
    
    print("Successfully seeded 40 financial transactions.")
    print("Finance & Payroll seeding completed!")

if __name__ == "__main__":
    seed_finance_data()
