# Generated by Django 3.2.14 on 2023-03-27 14:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0009_auto_20230327_0859'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sponsor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, max_length=100)),
                ('last_name', models.CharField(blank=True, max_length=100)),
                ('bronze_sponsor', models.IntegerField(default=0)),
                ('silver_sponsor', models.IntegerField(default=0)),
                ('gold_sponsor', models.IntegerField(default=0)),
                ('black_sponsor', models.IntegerField(default=0)),
                ('diamond_sponsor', models.IntegerField(default=0)),
                ('sponsor_score', models.IntegerField(default=0)),
            ],
        ),
        migrations.RemoveField(
            model_name='profile',
            name='black_sponsor',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='bronze_sponsor',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='diamond_sponsor',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='gold_sponsor',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='silver_sponsor',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='sponsor_score',
        ),
    ]
