import os
import django
import dotenv

dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.cafm.models import Facility, Asset, BMSDevice, BMSTelemetry

def seed_bms():
    hq = Facility.objects.filter(name='Global Headquarters').first()
    hvac = Asset.objects.filter(name='Primary HVAC Unit - Roof').first()
    
    if not hq:
        print("HQ not found, seeding aborted")
        return

    # Create HVAC Sensor
    dev1, _ = BMSDevice.objects.get_or_create(
        name='Roof HVAC Controller',
        device_type='HVAC',
        facility=hq,
        asset=hvac,
        external_id='BMS-HVAC-001'
    )
    BMSTelemetry.objects.create(device=dev1, reading_type='Temperature', value=22.5, unit='°C')
    
    # Create Energy Meter
    dev2, _ = BMSDevice.objects.get_or_create(
        name='Main Panel Meter',
        device_type='ENERGY',
        facility=hq,
        external_id='BMS-PWR-001'
    )
    BMSTelemetry.objects.create(device=dev2, reading_type='Total Power', value=45.2, unit='kW')

    # Create Lighting Controller
    dev3, _ = BMSDevice.objects.get_or_create(
        name='Lobby Lighting',
        device_type='LIGHTING',
        facility=hq,
        external_id='BMS-LIT-001'
    )
    BMSTelemetry.objects.create(device=dev3, reading_type='Brightness', value=80.0, unit='%')

    print('BMS Seed data created successfully')

if __name__ == '__main__':
    seed_bms()
