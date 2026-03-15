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

from django.contrib.auth import get_user_model
from apps.employees.models import Employee, Department, Designation
from apps.cafm.models import (
    Facility, Space, Asset, MaintenanceRequest, Vendor, 
    SLAPolicy, InventoryItem, PPMSchedule, WorkOrderStep,
    BMSDevice, BMSTelemetry
)

User = get_user_model()

def seed_cafm():
    print("🚀 Starting Comprehensive CAFM Data Seeding...")

    # 1. Setup default users/employees
    admin_user, _ = User.objects.get_or_create(username='admin', defaults={'email': 'admin@workforce360.com', 'is_superuser': True, 'is_staff': True})
    if _: 
        admin_user.set_password('admin123')
        admin_user.save()

    dept, _ = Department.objects.get_or_create(name='Facilities Management')
    desig_lead, _ = Designation.objects.get_or_create(name='Facilities Manager', department=dept)
    desig_tech, _ = Designation.objects.get_or_create(name='Maintenance Technician', department=dept)

    techs = []
    names = ['John Doe', 'Jane Smith', 'Mike Brown', 'Sarah Wilson']
    for i, name in enumerate(names):
        username = name.lower().replace(' ', '_')
        u, created = User.objects.get_or_create(username=username, defaults={'email': f'{username}@example.com'})
        if created:
            u.set_password('password123')
            u.save()
        
        emp, _ = Employee.objects.get_or_create(
            user=u,
            defaults={
                'department': dept,
                'designation': desig_tech if i > 0 else desig_lead,
                'date_of_joining': date(2022, 1, 15)
            }
        )
        techs.append(emp)

    # 2. Seed Vendors
    print("📦 Seeding Vendors...")
    Vendor.objects.all().delete()
    v1 = Vendor.objects.create(name="CoolFlow HVAC Solutions", contact_person="Robert Frost", email="service@coolflow.com", phone="+1-555-0199", service_type="HVAC", address="101 Arctic Way, Industriplex")
    v2 = Vendor.objects.create(name="SparkSafe Electrical", contact_person="Alice Volt", email="emergencies@sparksafe.net", phone="+1-555-0200", service_type="Electrical", address="42 Ohm St, Power District")
    v3 = Vendor.objects.create(name="AquaFix Plumbing", contact_person="Mario Pipes", email="info@aquafix.com", phone="+1-555-0300", service_type="Plumbing")
    v4 = Vendor.objects.create(name="Total Green Landscaping", contact_person="Flora Gardener", email="hello@totalgreen.com", phone="+1-555-0400", service_type="Landscaping")

    # 3. Seed SLA Policies
    print("📜 Seeding SLA Policies...")
    SLAPolicy.objects.all().delete()
    sla_critical = SLAPolicy.objects.create(name="Critical Infrastructure SLA", priority_level="CRITICAL", response_time_hours=1, resolution_time_hours=4, description="For life-safety and business-stopping failures.")
    sla_high = SLAPolicy.objects.create(name="High Priority SLA", priority_level="HIGH", response_time_hours=4, resolution_time_hours=12, description="For significant equipment failure with workarounds.")
    sla_standard = SLAPolicy.objects.create(name="Standard Maintenance SLA", priority_level="MEDIUM", response_time_hours=24, resolution_time_hours=72, description="Standard business requests.")
    sla_low = SLAPolicy.objects.create(name="Non-Urgent SLA", priority_level="LOW", response_time_hours=48, resolution_time_hours=120, description="Cosmetic or low-impact requests.")

    # 4. Seed Facilities & Spaces
    print("🏢 Seeding Facilities...")
    Facility.objects.all().delete()
    f1 = Facility.objects.create(name="Workforce Tech Park", address="100 Innovation Drive, Silicon Valley, CA")
    f2 = Facility.objects.create(name="Downtown Executive Suites", address="55 Wall St, Financial District, NY")
    
    Space.objects.all().delete()
    # F1 Spaces
    s1_f1 = Space.objects.create(facility=f1, name="Data Center West", space_type="Server Room", capacity=10)
    s2_f1 = Space.objects.create(facility=f1, name="Engineering Lab 1", space_type="Laboratory", capacity=40)
    s3_f1 = Space.objects.create(facility=f1, name="Cafe Terrace", space_type="Dining", capacity=100)
    # F2 Spaces
    s1_f2 = Space.objects.create(facility=f2, name="Boardroom Alpha", space_type="Meeting Room", capacity=25)
    s2_f2 = Space.objects.create(facility=f2, name="Reception Lobby", space_type="Common Area", capacity=50)

    # 5. Seed Assets
    print("🛠️ Seeding Assets...")
    Asset.objects.all().delete()
    a1 = Asset.objects.create(
        asset_id="AST-HVAC-001", name="Main Roof Chiller #1", category="HVAC", 
        asset_type="Chiller", status="ACTIVE", facility=f1, 
        vendor=v1, purchase_date=date(2021, 6, 1), installation_date=date(2021, 6, 15),
        purchase_cost=Decimal("45000.00"), expected_life_years=15, maintenance_frequency="Quarterly"
    )
    a2 = Asset.objects.create(
        asset_id="AST-UPS-001", name="Data Center UPS Stack", category="Electrical", 
        asset_type="UPS", status="ACTIVE", facility=f1, space=s1_f1,
        vendor=v2, purchase_date=date(2022, 1, 10), installation_date=date(2022, 1, 12),
        purchase_cost=Decimal("12500.00"), expected_life_years=8, maintenance_frequency="Monthly"
    )
    a3 = Asset.objects.create(
        asset_id="AST-KIT-001", name="Commercial Espresso Machine", category="Kitchen", 
        asset_type="Appliance", status="MAINTENANCE", facility=f1, space=s3_f1,
        purchase_date=date(2023, 3, 15), purchase_cost=Decimal("3200.00"), expected_life_years=5
    )
    a4 = Asset.objects.create(
        asset_id="AST-AV-001", name="8K Video Wall", category="AV", 
        asset_type="Display", status="ACTIVE", facility=f2, space=s2_f2,
        purchase_date=date(2022, 11, 20), purchase_cost=Decimal("18000.00"), expected_life_years=6
    )

    # 6. Seed Inventory
    print("📦 Seeding Inventory...")
    InventoryItem.objects.all().delete()
    InventoryItem.objects.create(name="HEPA Filter XL", sku="FIL-HEPA-01", quantity=12, min_quantity=5, unit_cost=Decimal("120.00"), location="Warehouse B", asset=a1)
    InventoryItem.objects.create(name="UPS Battery Module", sku="BAT-UPS-X1", quantity=2, min_quantity=4, unit_cost=Decimal("450.00"), location="Server Room Storage", asset=a2)
    InventoryItem.objects.create(name="HDMI 2.1 Cable 10m", sku="CAB-HDMI-10", quantity=25, min_quantity=10, unit_cost=Decimal("35.00"), location="IT Cage", asset=a4)

    # 7. Seed PPM Schedules
    print("📅 Seeding PPM Schedules...")
    PPMSchedule.objects.all().delete()
    PPMSchedule.objects.create(asset=a1, task_name="HVAC Filter Swap & Coil Clean", frequency="QUARTERLY", next_due_date=date.today() + timedelta(days=15), sla_policy=sla_standard, vendor=v1)
    PPMSchedule.objects.create(asset=a2, task_name="UPS Battery Health Audit", frequency="MONTHLY", next_due_date=date.today() + timedelta(days=5), sla_policy=sla_high, assigned_to=techs[1])

    # 8. Seed Maintenance Requests
    print("🎫 Seeding Maintenance Requests...")
    MaintenanceRequest.objects.all().delete()
    # 1. Critical Emergency (Overdue)
    r1 = MaintenanceRequest.objects.create(
        work_order_id="WO-2026-001", title="Power Failure in Data Center Row B", 
        description="UPS bypass active. Potential risk of server shutdown.",
        request_type="EMERGENCY", facility=f1, space=s1_f1, asset=a2,
        priority="CRITICAL", status="IN_PROGRESS", reported_by=admin_user, assigned_to=techs[1],
        sla_policy=sla_critical, sla_response_deadline=datetime.now() - timedelta(hours=2),
        sla_resolution_deadline=datetime.now() + timedelta(hours=2),
        estimated_cost=Decimal("1500.00")
    )
    # 2. Reactive Repair
    r2 = MaintenanceRequest.objects.create(
        work_order_id="WO-2026-002", title="Espresso Machine Grinder Jammed", 
        description="Grinder makes screeching noise and doesn't dispense coffee.",
        request_type="REACTIVE", facility=f1, space=s3_f1, asset=a3,
        priority="LOW", status="OPEN", reported_by=techs[0].user,
        sla_policy=sla_low, sla_response_deadline=datetime.now() + timedelta(days=1),
        sla_resolution_deadline=datetime.now() + timedelta(days=5)
    )
    # 3. Resolved Task (Target Met)
    r3 = MaintenanceRequest.objects.create(
        work_order_id="WO-2026-003", title="Video Wall Calibration", 
        description="Colors appear washed out on the right panel.",
        request_type="REACTIVE", facility=f2, space=s2_f2, asset=a4,
        priority="MEDIUM", status="RESOLVED", reported_by=admin_user, assigned_to=techs[2],
        sla_policy=sla_standard, 
        sla_response_deadline=datetime.now() - timedelta(days=2),
        sla_resolution_deadline=datetime.now() + timedelta(days=1),
        responded_at=datetime.now() - timedelta(days=1, hours=22),
        resolved_at=datetime.now() - timedelta(hours=2),
        actual_cost=Decimal("250.00")
    )

    # 4. Closed Task (Target Missed)
    r4 = MaintenanceRequest.objects.create(
        work_order_id="WO-2026-004", title="Leaking Sink in Cafe", 
        description="Faucet dripping constantly.",
        request_type="REACTIVE", facility=f1, space=s3_f1,
        priority="LOW", status="CLOSED", reported_by=techs[1].user, assigned_to=techs[3],
        sla_policy=sla_low, 
        sla_response_deadline=datetime.now() - timedelta(days=10),
        sla_resolution_deadline=datetime.now() - timedelta(days=5),
        responded_at=datetime.now() - timedelta(days=9),
        resolved_at=datetime.now() - timedelta(days=4), # Missed by 1 day
        actual_cost=Decimal("85.00")
    )

    # Add steps for r1
    WorkOrderStep.objects.create(request=r1, description="Isolate UPS unit", order=1, is_completed=True)
    WorkOrderStep.objects.create(request=r1, description="Diagnose battery cells", order=2, is_completed=True)
    WorkOrderStep.objects.create(request=r1, description="Replace identified faulty cells", order=3, is_completed=False)

    # 9. Seed BMS Devices
    print("🔋 Seeding BMS Devices...")
    BMSDevice.objects.all().delete()
    b1 = BMSDevice.objects.create(name="Central HVAC Controller", device_type="HVAC", asset=a1, facility=f1, external_id="BMS-HQ-HVAC-01", last_communication=datetime.now())
    b2 = BMSDevice.objects.create(name="Smart Lighting Zone A", device_type="LIGHTING", facility=f2, external_id="BMS-NY-LIT-01")

    # 10. Seed Telemetry
    BMSTelemetry.objects.create(device=b1, reading_type="Temperature", value=22.5, unit="°C")
    BMSTelemetry.objects.create(device=b1, reading_type="Pressure", value=101.3, unit="kPa")

    # 11. Seed Audits
    from apps.cafm.models import SystemAudit
    SystemAudit.objects.all().delete()
    SystemAudit.objects.create(facility=f1, audit_type="SAFETY", auditor=admin_user, audit_date=date.today() - timedelta(days=30), score=88, findings="Fire extinguishers need tags updated.")
    SystemAudit.objects.create(facility=f2, audit_type="ENERGY", auditor=admin_user, audit_date=date.today() - timedelta(days=15), score=94, findings="LED conversion 90% complete.")

    print("✅ CAFM Seeding Complete!")

if __name__ == "__main__":
    seed_cafm()
