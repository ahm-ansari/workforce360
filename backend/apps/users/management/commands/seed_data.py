from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import Role
from apps.employees.models import Department, Designation, Employee
from apps.hr.models import LeaveType, Leave, Attendance, DocumentCategory, Document
from apps.tasks.models import Task, ActivityLog
from apps.finance.models import Payroll, Reimbursement, Transaction
from apps.recruitment.models import Job, Candidate, Interview
from apps.visitors.models import Visitor, GateEntry, Vehicle
from datetime import datetime, timedelta
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed database with sample data for all modules'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting data seeding...')
        
        # Clear existing data (optional)
        self.stdout.write('Clearing existing data...')
        
        # Create Roles
        self.stdout.write('Creating roles...')
        roles_data = ['Admin', 'Manager', 'HR', 'Employee', 'Finance', 'Security']
        roles = {}
        for role_name in roles_data:
            role, created = Role.objects.get_or_create(
                name=role_name.lower(),
                defaults={'description': f'{role_name} role'}
            )
            roles[role_name.lower()] = role
            if created:
                self.stdout.write(f'  Created role: {role_name}')

        # Create Users
        self.stdout.write('Creating users...')
        users = {}
        
        # Admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@workforce360.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': roles['admin'],
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('  Created admin user')
        users['admin'] = admin_user

        # Manager user
        manager_user, created = User.objects.get_or_create(
            username='manager',
            defaults={
                'email': 'manager@workforce360.com',
                'first_name': 'John',
                'last_name': 'Manager',
                'role': roles['manager']
            }
        )
        if created:
            manager_user.set_password('manager123')
            manager_user.save()
            self.stdout.write('  Created manager user')
        users['manager'] = manager_user

        # HR user
        hr_user, created = User.objects.get_or_create(
            username='hr',
            defaults={
                'email': 'hr@workforce360.com',
                'first_name': 'Sarah',
                'last_name': 'HR',
                'role': roles['hr']
            }
        )
        if created:
            hr_user.set_password('hr123')
            hr_user.save()
            self.stdout.write('  Created HR user')
        users['hr'] = hr_user

        # Employee users
        employee_names = [
            ('Alice', 'Johnson'), ('Bob', 'Smith'), ('Charlie', 'Brown'),
            ('Diana', 'Wilson'), ('Eve', 'Davis')
        ]
        employees_users = []
        for first, last in employee_names:
            username = f'{first.lower()}.{last.lower()}'
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@workforce360.com',
                    'first_name': first,
                    'last_name': last,
                    'role': roles['employee']
                }
            )
            if created:
                user.set_password('employee123')
                user.save()
                self.stdout.write(f'  Created employee user: {username}')
            employees_users.append(user)

        # Create Departments
        self.stdout.write('Creating departments...')
        departments_data = ['Engineering', 'Human Resources', 'Finance', 'Sales', 'Marketing']
        departments = {}
        for dept_name in departments_data:
            dept, created = Department.objects.get_or_create(
                name=dept_name,
                defaults={'description': f'{dept_name} department'}
            )
            departments[dept_name] = dept
            if created:
                self.stdout.write(f'  Created department: {dept_name}')

        # Create Designations
        self.stdout.write('Creating designations...')
        designations_data = [
            ('Software Engineer', 'Engineering'),
            ('Senior Engineer', 'Engineering'),
            ('HR Manager', 'Human Resources'),
            ('Accountant', 'Finance'),
            ('Sales Executive', 'Sales')
        ]
        designations = {}
        for desig_name, dept_name in designations_data:
            desig, created = Designation.objects.get_or_create(
                name=desig_name,
                department=departments[dept_name],
                defaults={'description': f'{desig_name} position'}
            )
            designations[desig_name] = desig
            if created:
                self.stdout.write(f'  Created designation: {desig_name}')

        # Create Employees
        self.stdout.write('Creating employees...')
        employees = []
        employee_data = [
            (users['admin'], departments['Engineering'], designations['Senior Engineer']),
            (users['manager'], departments['Engineering'], designations['Senior Engineer']),
            (users['hr'], departments['Human Resources'], designations['HR Manager']),
        ]
        
        for user in employees_users:
            dept = random.choice(list(departments.values()))
            desig = random.choice(list(designations.values()))
            employee_data.append((user, dept, desig))

        for user, dept, desig in employee_data:
            emp, created = Employee.objects.get_or_create(
                user=user,
                defaults={
                    'department': dept,
                    'designation': desig,
                    'date_of_joining': datetime.now().date() - timedelta(days=random.randint(30, 365)),
                    'address': f'{random.randint(100, 999)} Main St, City',
                    'emergency_contact': f'+1-555-{random.randint(1000, 9999)}'
                }
            )
            employees.append(emp)
            if created:
                self.stdout.write(f'  Created employee: {user.username}')

        # Create Leave Types
        self.stdout.write('Creating leave types...')
        leave_types_data = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave']
        leave_types = {}
        for lt_name in leave_types_data:
            lt, created = LeaveType.objects.get_or_create(
                name=lt_name,
                defaults={'max_days_per_year': 10 if 'Annual' not in lt_name else 20}
            )
            leave_types[lt_name] = lt
            if created:
                self.stdout.write(f'  Created leave type: {lt_name}')

        # Create Leave Requests
        self.stdout.write('Creating leave requests...')
        for i in range(10):
            emp = random.choice(employees)
            lt = random.choice(list(leave_types.values()))
            start_date = datetime.now().date() + timedelta(days=random.randint(1, 30))
            Leave.objects.get_or_create(
                employee=emp,
                leave_type=lt,
                start_date=start_date,
                defaults={
                    'end_date': start_date + timedelta(days=random.randint(1, 5)),
                    'reason': f'Sample leave request {i+1}',
                    'status': random.choice(['PENDING', 'APPROVED', 'REJECTED'])
                }
            )
        self.stdout.write('  Created 10 leave requests')

        # Create Attendance Records
        self.stdout.write('Creating attendance records...')
        for emp in employees[:5]:
            for day in range(5):
                date = datetime.now().date() - timedelta(days=day)
                Attendance.objects.get_or_create(
                    employee=emp,
                    date=date,
                    defaults={
                        'check_in': datetime.strptime('09:00', '%H:%M').time(),
                        'check_out': datetime.strptime('17:00', '%H:%M').time(),
                        'status': 'PRESENT'
                    }
                )
        self.stdout.write('  Created attendance records')

        # Create Document Categories
        self.stdout.write('Creating document categories...')
        doc_categories = {}
        for cat_name in ['ID Proof', 'Certificates', 'Contracts']:
            cat, created = DocumentCategory.objects.get_or_create(name=cat_name)
            doc_categories[cat_name] = cat
            if created:
                self.stdout.write(f'  Created document category: {cat_name}')

        # Create Tasks
        self.stdout.write('Creating tasks...')
        task_titles = [
            'Complete project documentation',
            'Review code changes',
            'Prepare quarterly report',
            'Update employee handbook',
            'Conduct team meeting'
        ]
        tasks = []
        for i, title in enumerate(task_titles):
            task, created = Task.objects.get_or_create(
                title=title,
                defaults={
                    'description': f'Description for {title}',
                    'assigned_to': random.choice(employees),
                    'assigned_by': users['manager'],
                    'status': random.choice(['TODO', 'IN_PROGRESS', 'COMPLETED']),
                    'priority': random.choice(['LOW', 'MEDIUM', 'HIGH']),
                    'due_date': datetime.now().date() + timedelta(days=random.randint(1, 14))
                }
            )
            tasks.append(task)
            if created:
                self.stdout.write(f'  Created task: {title}')

        # Create Payrolls
        self.stdout.write('Creating payroll records...')
        for emp in employees[:5]:
            Payroll.objects.get_or_create(
                employee=emp,
                month=datetime.now().month,
                year=datetime.now().year,
                defaults={
                    'basic_salary': Decimal('50000.00'),
                    'allowances': Decimal('5000.00'),
                    'deductions': Decimal('2000.00'),
                    'status': random.choice(['DRAFT', 'PROCESSED', 'PAID'])
                }
            )
        self.stdout.write('  Created payroll records')

        # Create Reimbursements
        self.stdout.write('Creating reimbursements...')
        for i in range(5):
            Reimbursement.objects.create(
                employee=random.choice(employees),
                amount=Decimal(random.randint(100, 1000)),
                description=f'Travel expense {i+1}',
                status=random.choice(['PENDING', 'APPROVED', 'REJECTED'])
            )
        self.stdout.write('  Created 5 reimbursements')

        # Create Transactions
        self.stdout.write('Creating transactions...')
        for i in range(10):
            Transaction.objects.create(
                type=random.choice(['INCOME', 'EXPENSE']),
                amount=Decimal(random.randint(1000, 10000)),
                description=f'Sample transaction {i+1}'
            )
        self.stdout.write('  Created 10 transactions')

        # TEMPORARILY DISABLED - Table name mismatch issue
        # # Create Jobs
        # self.stdout.write('Creating job postings...')
        # job_titles = ['Senior Developer', 'HR Manager', 'Marketing Specialist', 'Sales Executive']
        # jobs = []
        # for title in job_titles:
        #     job, created = Job.objects.get_or_create(
        #         title=title,
        #         defaults={
        #             'description': f'We are looking for a {title}',
        #             'requirements': 'Bachelor degree, 3+ years experience',
        #             'department': random.choice(list(departments.values())),
        #             'posted_by': users['hr'],
        #             'status': random.choice(['DRAFT', 'PUBLISHED', 'CLOSED']),
        #             'closing_date': datetime.now().date() + timedelta(days=30)
        #         }
        #     )
        #     jobs.append(job)
        #     if created:
        #         self.stdout.write(f'  Created job: {title}')

        # # Create Candidates
        # self.stdout.write('Creating candidates...')
        # candidate_names = ['Michael Scott', 'Pam Beesly', 'Jim Halpert', 'Dwight Schrute']
        # for name in candidate_names:
        #     first, last = name.split()
        #     Candidate.objects.get_or_create(
        #         name=name,
        #         email=f'{first.lower()}.{last.lower()}@example.com',
        #         defaults={
        #             'phone': f'+1-555-{random.randint(1000, 9999)}',
        #             'job': random.choice(jobs),
        #             'status': random.choice(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED'])
        #         }
        #     )
        # self.stdout.write('  Created 4 candidates')

        # # Create Visitors
        # self.stdout.write('Creating visitors...')
        # visitor_names = ['John Visitor', 'Jane Guest', 'Bob Client']
        # for name in visitor_names:
        #     Visitor.objects.get_or_create(
        #         name=name,
        #         defaults={
        #             'phone': f'+1-555-{random.randint(1000, 9999)}',
        #             'company': 'ABC Corp',
        #             'purpose_of_visit': 'Business meeting',
        #             'host_employee': random.choice(employees),
        #             'id_proof_type': 'NATIONAL_ID',
        #             'id_proof_number': f'ID{random.randint(10000, 99999)}'
        #         }
        #     )
        # self.stdout.write('  Created 3 visitors')

        self.stdout.write(self.style.SUCCESS('Data seeding completed successfully!'))
        self.stdout.write('')
        self.stdout.write('Login credentials:')
        self.stdout.write('  Admin: username=admin, password=admin123')
        self.stdout.write('  Manager: username=manager, password=manager123')
        self.stdout.write('  HR: username=hr, password=hr123')
        self.stdout.write('  Employees: username=<firstname>.<lastname>, password=employee123')
