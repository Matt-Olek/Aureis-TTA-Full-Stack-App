# Generated by Django 5.0.7 on 2024-09-30 01:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matching', '0019_alter_match_applicant_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='joboffer',
            name='token',
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
        migrations.DeleteModel(
            name='OfferToken',
        ),
    ]
