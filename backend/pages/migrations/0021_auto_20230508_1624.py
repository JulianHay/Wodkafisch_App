# Generated by Django 3.2.14 on 2023-05-08 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0020_sponsor_unlocked_items_animation'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='description',
            new_name='message',
        ),
        migrations.AddField(
            model_name='event',
            name='additional_text',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='bye',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='hello',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='location',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
