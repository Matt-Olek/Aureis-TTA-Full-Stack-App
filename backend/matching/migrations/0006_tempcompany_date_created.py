# Generated by Django 5.0.7 on 2024-07-26 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matching', '0005_tempcompany'),
    ]

    operations = [
        migrations.AddField(
            model_name='tempcompany',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
