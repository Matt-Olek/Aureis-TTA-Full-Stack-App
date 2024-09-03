# Generated by Django 5.0.7 on 2024-07-26 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matching', '0002_tempapplicant'),
    ]

    operations = [
        migrations.AddField(
            model_name='tempapplicant',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='tempapplicant',
            name='email',
            field=models.EmailField(default='', max_length=254, unique=True),
        ),
    ]
