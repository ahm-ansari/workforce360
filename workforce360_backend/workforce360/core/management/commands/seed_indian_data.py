from django.core.management.base import BaseCommand
from django_seed import Seed
from faker import Faker
import random
import pycountry

from users.models import User

from core.models import Type, Phone, Email, Address, Country, State, City, Zipcode, languages


''' 
    
    
    City(models.Model): id = models.AutoField(primary_key=True), name = models.CharField(max_length=200), code = models.CharField(max_length=200), state = models.ForeignKey(State, on_delete=models.CASCADE)
    Zipcode(models.Model): id = models.AutoField(primary_key=True), code = models.CharField(max_length=200),  city = models.ForeignKey(City, on_delete=models.CASCADE),
    languages(models.Model): id = models.AutoField(primary_key=True),  language_name = models.CharField(max_length=200), description = models.TextField(max_length=200)
'''
class Command(BaseCommand):
    help = 'Seeds the database with Indian data.'

    def handle(self, *args, **options):
        # Initialize Faker with the Indian locale
        fake_in = Faker('en_IN')
        
        # --- Seeding Users (with Indian names) ---
        seeder = Seed.seeder()
        seeder.faker.locale = 'en_IN'  # Use Indian locale for names

        # Data Fields :: Type : id = primary_key, type_name = CharField, description = TextField
        seeder.add_entity(Type, 10, {
            'type_name': lambda x: fake_in.word(),
            'description': lambda x: fake_in.sentence(),
        })
        seeder.execute()

        # Data Fields:: Phone: id, number = CharField, type = ForeignKey(Type), is_active = BooleanField(),created_at = DateTimeField, updated_at = DateTimeField(auto_now=True)
        seeder = Seed.seeder()
        seeder.add_entity(Phone, 10, {
            'number': lambda x: fake_in.phone_number(),
            'type': lambda x: random.choice(Type.objects.all()),
            'is_active': lambda x: random.choice([True, False]),
            'created_at': lambda x: fake_in.date_time(),
            'updated_at': lambda x: fake_in.date_time()
        })
        seeder.execute()

        # Data Fields:: Email: id, email_address = EmailField, type = ForeignKey(Type), is_active = BooleanField(), created_at = DateTimeField(), updated_at = DateTimeField()
        seeder = Seed.seeder()
        seeder.add_entity(Email, 10, {
            'email_address': lambda x: fake_in.email(),
            'type': lambda x: random.choice(Type.objects.all()),
            'is_active': lambda x: random.choice([True, False]),
            'created_at': lambda x: fake_in.date_time(),
            'updated_at': lambda x: fake_in.date_time()
        })
        seeder.execute()

        #Data Fields:: Country: id, name = models.CharField(max_length=200), code = models.CharField(max_length=200)
        Country.objects.all().delete()

        # Create a list of Country objects
        countries_to_create = [
            Country(
                name=country.name,
                code=country.alpha_3,
            )
            for country in pycountry.countries
        ]

        # Use bulk_create for a single efficient database transaction
        Country.objects.bulk_create(countries_to_create, ignore_conflicts=True)

        # State: id, name = CharField(max_length=200), code = models.CharField(max_length=200), country = models.ForeignKey(Country, on_delete=models.CASCADE)
        for _ in range(2, 32):
            States = State(
                name=fake_in.state(),
                #code = fake_in.state_abbr(),
                country=random.choice(Country.objects.all()),
            )
            States.save()
        
        for _ in range(100):
            Cities = City(
                name=fake_in.city(),
                code=fake_in.city_suffix(),
                state=random.choice(State.objects.all()),
            )
            Cities.save()

        for _ in range(200):
            pincode = Zipcode(
                code=fake_in.postcode(),
                city=random.choice(City.objects.all()),
            )
            pincode.save()

        for _ in range(10):
            language = languages(
                language_name=fake_in.language_name(),
                description=fake_in.sentence(),
            )
            language.save() 

        
        #Data Fields:: Address: id, street = CharField(), address2 = TextField(), type = ForeignKey(Type), zipcode = ForeignKey('Zipcode'), is_active = BooleanField(), created_at, updated_at
        seeder = Seed.seeder()
        seeder.add_entity(Address, 10, {
            'street': lambda x: fake_in.street_address(),
            'address2': lambda x: fake_in.street_name(),
            'type': lambda x: random.choice(Type.objects.all()),
            'zipcode': lambda x: random.choice(Zipcode.objects.all()),
            'is_active': lambda x: random.choice([True, False]),
            'created_at': lambda x: fake_in.date_time(),
            'updated_at': lambda x: fake_in.date_time()
        })
        seeder.execute()
        # password, first_name, last_name, id, email, username, is_staff, is_superuser, is_active, last_login, date_joined, password_changed, token, is_employee, is_jobseeker, is_admin, phone_number, created_at, updated_at, person_id
        for _ in range(10):
            User.objects.create_user(
                username=fake_in.user_name(),
                email=fake_in.email(),
                password='password123',
                first_name=fake_in.first_name(),
                last_name=fake_in.last_name(),
                is_staff=random.choice([True, False]),
                is_superuser=random.choice([True, False]),
                is_employee=random.choice([True, False]),
                is_jobseeker=random.choice([True, False]),
                is_admin=random.choice([True, False]),
                phone_number=fake_in.phone_number()
            )




                                            
        self.stdout.write(self.style.SUCCESS("Seeded Users."))