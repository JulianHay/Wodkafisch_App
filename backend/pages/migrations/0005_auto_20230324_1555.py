# Generated by Django 3.2.14 on 2023-03-24 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0004_auto_20230323_0625'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='lat',
            field=models.DecimalField(blank=True, decimal_places=9, max_digits=20, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='long',
            field=models.DecimalField(blank=True, decimal_places=9, max_digits=20, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='description',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='events/', verbose_name='Pictures'),
        ),
        migrations.AlterField(
            model_name='event',
            name='title',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='user',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='fischpictures',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='fisch_pictures/', verbose_name='Pictures'),
        ),
        migrations.AlterField(
            model_name='fischpictures',
            name='lat',
            field=models.DecimalField(blank=True, decimal_places=9, max_digits=20, null=True),
        ),
        migrations.AlterField(
            model_name='fischpictures',
            name='long',
            field=models.DecimalField(blank=True, decimal_places=9, max_digits=20, null=True),
        ),
    ]
