import os
import django
import dotenv
from datetime import datetime

dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.cafm.models import CAFMAuditLog, MaintenanceCommunication, MaintenanceRequest
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_management_data():
    admin = User.objects.filter(is_superuser=True).first()
    if not admin:
        admin = User.objects.first()
    
    req = MaintenanceRequest.objects.first()

    if not all([admin, req]):
        print("Required base data missing (User or Request), seeding aborted")
        return

    # 1. Audit Logs
    CAFMAuditLog.objects.create(
        user=admin,
        action='SYSTEM_UPDATE',
        resource_type='GLOBAL_SETTINGS',
        details='Updated maintenance SLA response threshold to 4 hours.'
    )
    
    CAFMAuditLog.objects.create(
        user=admin,
        action='ASSET_IMPORT',
        resource_type='ASSET',
        details='Bulk imported 50 new fire extinguishers via CSV.'
    )

    # 2. Communications
    MaintenanceCommunication.objects.create(
        request=req,
        sender=admin,
        message="Technician is on the way. Please ensure roof access is granted."
    )

    print('CAFM Management & Administration data seeded successfully')

if __name__ == '__main__':
    seed_management_data()
