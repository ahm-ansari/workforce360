from django.db import models

class Type(models.Model):
    id = models.AutoField(primary_key=True)
    type_name = models.CharField(max_length=200)
    description = models.TextField(max_length=200)

    def __str__(self):
        return self.id
class Phone(models.Model):
    id = models.AutoField(primary_key=True)
    number = models.CharField(max_length=200)
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    is_active = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class Email(models.Model):
    id = models.AutoField(primary_key=True)
    email_address = models.EmailField(max_length=200, unique=True, blank=False, null=False, default='example@example.com')
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    is_active = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id

class Address(models.Model):
    id = models.AutoField(primary_key=True)
    street = models.CharField(max_length=200)
    address2 = models.TextField(max_length=200)
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    zipcode = models.ForeignKey('Zipcode', on_delete=models.CASCADE)
    is_active = models.BooleanField()
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.id

class Country(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=200)

    def __str__(self):
        return self.id

class State(models.Model):
    id = models.AutoField(primary_key=True) 
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=200)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def __str__(self):
        return self.id

class City(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=200)
    state = models.ForeignKey(State, on_delete=models.CASCADE)

    def __str__(self):
        return self.id

class Zipcode(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    def __str__(self):
        return self.id

class languages(models.Model):
    id = models.AutoField(primary_key=True)
    language_name = models.CharField(max_length=200)
    description = models.TextField(max_length=200)

    def __str__(self):
        return self.id
    
class position(models.Model):
    id = models.AutoField(primary_key=True)
    position_name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    description = models.TextField(max_length=200)

    def __str__(self):
        return self.id