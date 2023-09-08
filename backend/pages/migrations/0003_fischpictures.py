# Generated by Django 3.2.14 on 2023-03-23 04:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0002_auto_20230321_1832'),
    ]

    operations = [
        migrations.CreateModel(
            name='FischPictures',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='media/date/photos/', verbose_name='Photos')),
                ('lat', models.DecimalField(decimal_places=6, max_digits=20)),
                ('long', models.DecimalField(decimal_places=6, max_digits=20)),
            ],
        ),
    ]
