from django.db import models
from core.models import (Phone, Email, Address)

# Create your models here.

class Person(models.Model):
    id = models.AutoField(primary_key=True)
    prefix = models.CharField(max_length=200)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    postfix = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class Phone(models.Model):
    id = models.AutoField(primary_key=True)
    phone = models.ForeignKey(Phone, on_delete=models.CASCADE, default="xxx-xxx-xxxx")
    person = models.ForeignKey(Person, on_delete=models.CASCADE, default=1)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id


class Email(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, default=1)
    email_address = models.ForeignKey(Email, on_delete=models.CASCADE, null=False, blank=False, default='0')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class Post_Address(models.Model):
    id = models.AutoField(primary_key=True)
    post_id = models.ForeignKey(Address, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    is_primary = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class demographics(models.Model):
    id = models.AutoField(primary_key=True)
    demo_name = models.CharField(max_length=200)
    demo_value = models.CharField(max_length=200)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class education(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    degree = models.CharField(max_length=200)
    major = models.CharField(max_length=200)
    school = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    
    def __str__(self):
        return self.id

class experience(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    company = models.CharField(max_length=200)
    job_role = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(max_length=200) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.id

class skills(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    skill_name = models.CharField(max_length=200)
    skill_level = models.CharField(max_length=200)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class certificates(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    certificate_name = models.CharField(max_length=200)
    issue_date = models.DateField()
    expiration_date = models.DateField()
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class languages(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    language_name = models.CharField(max_length=200)
    language_level = models.CharField(max_length=200)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class interests(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    interest_name = models.CharField(max_length=200)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class hobbies(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    hobby_name = models.CharField(max_length=200)
    description = models.TextField(max_length=200)

    def __str__(self):
        return self.id

class achievements(models.Model):
    id = models.AutoField(primary_key=True) 
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    achievement_name = models.CharField(max_length=200)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class awards(models.Model):
    id = models.AutoField(primary_key=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    award_name = models.CharField(max_length=200)
    award_date = models.DateField()
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id












