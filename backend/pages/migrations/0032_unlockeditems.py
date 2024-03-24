# Generated by Django 4.2.3 on 2024-03-19 17:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pages', '0031_merch'),
    ]

    operations = [
        migrations.CreateModel(
            name='UnlockedItems',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('distributed', models.BooleanField(default=False)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pages.seasonitem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pages.profile')),
            ],
        ),
    ]