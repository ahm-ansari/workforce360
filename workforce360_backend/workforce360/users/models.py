from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from person.models import Person

class UserManager(BaseUserManager):
    """Custom user manager using email instead of username."""

    def create_user(self, username, password='password123', **extra_fields):
        if not username:
            raise ValueError("The Username field is required")

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_admin", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, password, **extra_fields)


class User(AbstractUser):
    """Custom user model for all user roles."""
    id: models.AutoField= models.AutoField(primary_key=True)

    email: models.EmailField= models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    person:models.ForeignKey= models.ForeignKey(Person, on_delete=models.CASCADE, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)
    password_changed: models.BooleanField= models.BooleanField(default=False)
    token: models.CharField= models.CharField(max_length=100, blank=True, null=True)
    is_employee:models.BooleanField = models.BooleanField(default=False)
    is_jobseeker:models.BooleanField = models.BooleanField(default=False)
    is_admin:models.BooleanField = models.BooleanField(default=False)
    phone_number:models.CharField = models.CharField(max_length=15, blank=True, null=True)
    created_at: models.DateTimeField= models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField= models.DateTimeField(auto_now=True)

    objects = UserManager()  # type: ignore[assignment]

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "username"

    def __str__(self):
        return self.username


