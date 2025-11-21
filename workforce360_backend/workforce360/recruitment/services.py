from django.contrib.auth.models import User
from django.db import transaction, IntegrityError
from datetime import date
import random
import string
from django.utils import timezone


# Import models from the recruitment app

from .models import JobApplication 
from employees.models import Employee
from person.models import Person 



# Import models from the users app (assuming you created a user profile app)
from users.models import UserProfile, Role 

# Placeholder for your Employee Details model (assuming it lives in users or a dedicated HR app)
# You should define this model later to hold salary, start_date, etc.
# For now, we will assume a simple EmployeeDetails model exists in the users app.


def generate_username(name):
    """Generates a simple unique username from the applicant's name."""
    parts = name.lower().split()
    base_username = parts[0] + parts[-1] if len(parts) > 1 else parts[0]
    
    # Add a random number suffix to ensure near-uniqueness
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"{base_username[:10]}{suffix}"

def generate_temp_password():
    """Generates a temporary secure password."""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=12))

@transaction.atomic
def hire_applicant(application_id: int, initial_salary: float, start_date: date, job_title: str):
    """
    Processes the hiring transition:
    1. Updates the JobApplication status.
    2. Creates a new Django User account.
    3. Creates a linked EmployeeDetails record.
    4. Assigns the 'Employee' role to the new user.
    """
    try:
        # 1. Retrieve the Application
        application = JobApplication.objects.select_related('listing').get(id=application_id)
    except JobApplication.DoesNotExist:
        raise ValueError(f"Job application with ID {application_id} not found.")

    if application.status == 'Hired':
        raise ValueError("Applicant is already hired.")

    # Generate credentials
    temp_password = generate_temp_password()
    username = generate_username(Person.first_name)
    
    try:
        # 2. Create Django User Account
        new_user = User.objects.create_user(
            username=username,
            email=application.applicant.email, # Assuming email field exists on JobApplication
            password=temp_password,
            first_name=Person.first_name,
            last_name=Person.last_name,
            is_employee=True,
            is_active=True
        )
        
        # 3. Create Employee Details Record
        Employee.objects.create(
            Person=Person,
            emp_code = f"EMP-{str(application.id)[:8]}",
            status = 'Active',
            is_active = True,
            is_deleted = False,
            dataofjoining = start_date,
            is_blocked = False,
            created_at = timezone.now(),
            updated_at = timezone.now(),
            performance_score = 0.0,
        )

        # 4. Assign the 'Employee' Role
        try:
            employee_role = Role.objects.get(name='Employee')
            user_profile, created = UserProfile.objects.get_or_create(user=new_user)
            user_profile.roles.add(employee_role)
        except Role.DoesNotExist:
            print("Warning: 'Employee' role not found. Role assignment skipped.")
        
        # 5. Finalize Application Status
        application.status = 'Hired'
        application.save()

        return {
            "success": True,
            "employee_user": new_user,
            "temp_password": temp_password
        }

    except IntegrityError:
        # Catch potential username collision or other DB constraint errors
        raise IntegrityError("Failed to create user. Credentials may already exist.")
    except Exception as e:
        # Reraise any other unexpected exception, transaction will rollback automatically
        raise Exception(f"Hiring process failed: {str(e)}")

# --- END OF FILE ---