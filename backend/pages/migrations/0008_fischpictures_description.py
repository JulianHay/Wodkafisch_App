# Generated by Django 3.2.14 on 2023-03-26 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0007_alter_event_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='fischpictures',
            name='description',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
    ]
