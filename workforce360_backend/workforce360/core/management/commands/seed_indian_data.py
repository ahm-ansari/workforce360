from django.core.management.base import BaseCommand
from django_seed import Seed
from faker import Faker
import random
import pycountry

from users.models import User
from person.models import Person, Phone, Email, Address, Post_Address, Demographics, Education, Experience, Skills, Certificates, Languages, Interests, Hobbies, Achievements, Awards

from employees.models import Employee, Employee_Attendance, Employee_Leave, Employee_Payroll, EmployeeDemoGraphics

from core.models import Type, Phone, Email, Address, Country, State, City, Zipcode, languages

from datetime import datetime

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

        start_date = datetime(2022, 1, 1)
        end_date = datetime(2025, 11, 1)

        # Generate a random date between the specified dates
        random_date = fake_in.date_between_dates(date_start=start_date, date_end=end_date)
        start_datetime = datetime(2022, 1, 1, 0, 0, 0)
        end_datetime = datetime(2025, 11, 1, 23, 59, 59)

        # Generate a random datetime within the specified range
        random_datetime = fake_in.date_time_between(start_date=start_datetime, end_date=end_datetime)

        # Data Fields :: Type : id = primary_key, type_name = CharField, description = TextField
        '''seeder.add_entity(Type, 10, {
            'type_name': lambda x: fake_in.word(),
            'description': lambda x: fake_in.sentence(),
        })
        seeder.execute()

        

        # Data Fields:: Phone: id, number = CharField, type = ForeignKey(Type), is_active = BooleanField(),created_at = DateTimeField, updated_at = DateTimeField(auto_now=True)
        seeder = Seed.seeder()
        seeder.add_entity(Phone, 1000, {
            'number': lambda x: fake_in.phone_number(),
            'type': lambda x: random.choice(Type.objects.all()),
            'is_active': lambda x: random.choice([True, False]),
            'created_at': lambda x: fake_in.date_time(),
            'updated_at': lambda x: fake_in.date_time()
        })
        seeder.execute()

        # Data Fields:: Email: id, email_address = EmailField, type = ForeignKey(Type), is_active = BooleanField(), created_at = DateTimeField(), updated_at = DateTimeField()
        seeder = Seed.seeder()
        seeder.add_entity(Email, 1000, {
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
        # functional Error Duplication name, Code is not place
        for _ in range(2, 32):
            States = State(
                name=fake_in.state(), # Error: Duplicates found
                #code = fake_in.state_abbr(), # No Code Generated
                country=random.choice(Country.objects.all()), # Random Choice taken may mislead different country, No correct matches found
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
        seeder.add_entity(Address, 990, {
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
    
        # id, prefix, first_name, last_name, postfix, created_at, updated_at, date_of_birth, gender
        for _ in range(1000):
            Person.objects.create(
                prefix=fake_in.prefix(),
                first_name=fake_in.first_name(),
                last_name=fake_in.last_name(),
                postfix=fake_in.suffix(),
                date_of_birth=fake_in.date_of_birth(),
                gender=random.choice(['Male', 'Female']),
            )
        
        # id, emp_code, status, is_active, is_deleted, dataofjoining, dataofleaving, is_blocked, created_at, updated_at, person_id, reporting_manager_id
        for _ in range(1000):
            try:
                 Employee.objects.create(
                    emp_code = "WF"+str(_).zfill(5),
                    status = random.choice(["Active", "Inactive", "Terminated", "On Leave", "Resigned"]),
                    is_active = random.choice([True, False]),
                    is_deleted = random.choice([True, False]),
                    dataofjoining = fake_in.date_time(),
                    dataofleaving = fake_in.date_time(),
                    is_blocked = random.choice([True, False]),
                    person = random.choice(Person.objects.all()),
                    reporting_manager = random.choice(Employee.objects.all())
                )
            except Exception as e:
                    print(e)
        
        # id, date, in_time, out_time, created_at, updated_at, employee_id
        for _ in range(3000):
            try:
                Employee_Attendance.objects.create(
                    date = random_date,
                    in_time = fake_in.time(),
                    out_time = fake_in.time(),
                    created_at = random_datetime,
                    updated_at = random_datetime,
                    employee = random.choice(Employee.objects.all())
                )
            except Exception as e:
                print(e)
                                            
        self.stdout.write(self.style.SUCCESS("Seeded Users."))
    
        # id, leave_type, start_date, end_date, status, created_at, updated_at, approved_by_id, employee_id
        for _ in range(1500):
            Employee_Leave.objects.create(
                    leave_type = random.choice(["Sick Leave", "Casual Leave", "Maternity Leave", "Paternal Leave", "Bereavement Leave"]),
                    start_date = random_date,
                    end_date = random_date,
                    status = random.choice(["Pending", "Approved", "Rejected"]),
                    created_at = random_datetime,
                    updated_at = random_datetime,
                    approved_by = random.choice(Employee.objects.all()),
                    employee = random.choice(Employee.objects.all())
                )
            try:
                print(_)
            except Exception as e:
                print(e)
        
        # id, salary, bonus, overtime, esi, pf, loan, insurance, deduction, created_at, updated_at, employee_id
        for _ in range(1000):
            Employee_Payroll.objects.create(
                salary = random.randint(10000, 100000),
                bonus = random.randint(1000, 10000),
                overtime = random.randint(1000, 10000),
                esi = random.randint(1000, 10000),
                pf = random.randint(1000, 10000),
                loan = random.randint(1000, 10000),
                insurance = random.randint(1000, 10000),
                deduction = random.randint(1000, 10000),
                created_at = random_datetime,
                updated_at = random_datetime,
                employee = random.choice(Employee.objects.all())
            )
        
        # id, marital_status, nationality, religion, ethnic_group, employee_id
        for _ in range(1000):
            try:
                EmployeeDemoGraphics.objects.create(
                    marital_status = random.choice(["Married", "Unmarried", "Divorced", "Widowed"]),
                    nationality = random.choice(["Indian", "Foreigner"]),
                    religion = random.choice(["Hindu", "Muslim", "Christian", "Sikh", "Other"]),
                    ethnic_group = random.choice(["Asian", "African", "Caucasian", "Hispanic", "Other"]),
                    employee = random.choice(Employee.objects.all())
                )
            except Exception as e:
                print(e)
        
        # id, achievement_name, description, created_at, updated_at, person_id
        for _ in range(1000):
            try:
                Achievements.objects.create(
                    achievement_name = fake_in.word(),
                    description = fake_in.sentence(),
                    created_at = random_datetime,
                    updated_at = random_datetime,
                    person = random.choice(Person.objects.all())
                )
            except Exception as e:
                print(e)
        
        #id, award_name, award_date, description, created_at, updated_at, person_id
        for _ in range(1000):
            try:
                Awards.objects.create(
                    award_name = fake_in.word(),
                    award_date = random_date,
                    description = fake_in.sentence(),
                    created_at = random_datetime,
                    updated_at = random_datetime,
                    person = random.choice(Person.objects.all())
                )
            except Exception as e:
                print(e)
        
        #id, certificate_name, issue_date, expiration_date, description, created_at, updated_at, person_id
        for _ in range(1000):
            try:
                Certificates.objects.create(
                    certificate_name = fake_in.word(),
                    issue_date = random_date,
                    expiration_date = random_date,
                    description = fake_in.sentences(),
                    created_at = random_datetime,
                    updated_at = random_datetime,
                    person = random.choice(Person.objects.all())
                )
            except Exception as e:
                print(e)
        
        # id, demo_name, demo_value, description, created_at, updated_at, person_id
        for _ in range(1500):
            demo_name = random.choice(["Marital Status", "Nationality", "Religion", "Ethnic Group", "Gender", "Age Group" ])
            demo_value = ""
            if demo_name == "Marital Status":
                demo_value = random.choice(["Married", "Unmarried", "Divorced", "Widowed"])
            elif demo_name == "Nationality":
                demo_value = random.choice(["Indian", "Foreigner"])
            elif demo_name == "Religion":
                demo_value = random.choice(["Hindu", "Muslim", "Christian", "Sikh", "Other"])
            elif demo_name == "Ethnic Group":
                demo_value = random.choice(["Asian", "African", "Caucasian", "Hispanic", "Other"])
            elif demo_name == "Gender":
                demo_value = random.choice(["Male", "Female"])
            elif demo_name == "Age Group":
                demo_value = random.choice(["18-24", "25-34", "35-44", "45-54", "55-64", "65+"])
            else:
                demo_value = fake_in.word()

            try:
                Demographics.objects.create(
                    demo_name = demo_name,
                    demo_value = demo_value,
                    description = fake_in.sentences(),
                    created_at = random_datetime,
                    updated_at = random_datetime,
                    person = random.choice(Person.objects.all())
                )
            except Exception as e:
                print(e)
        '''
        # id, degree, major, school, start_date, end_date, person_id
        for _ in range(1000):
            try:
                Education.objects.create(
                    degree = random.choice(["Bachelor's", "Master's", "Ph.D.","Others"]),
                    major = random.choice(["Engineering", "Arts & Science","Business","Other"]),
                    school = random.choice(["High School", "College", "University", "Other"]),
                    start_date = random_date,
                    end_date = random_date,
                    person = random.choice(Person.objects.all())
                )
            except Exception as e:
                print(e)

                                            
        self.stdout.write(self.style.SUCCESS("Seeded Users."))