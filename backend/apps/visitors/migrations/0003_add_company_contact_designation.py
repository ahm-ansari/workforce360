from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('visitors', '0002_create_company'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='contact_person_designation',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
