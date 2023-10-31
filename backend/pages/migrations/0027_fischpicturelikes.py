# Generated by Django 4.2.3 on 2023-10-31 07:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0026_event_country'),
    ]

    operations = [
        migrations.CreateModel(
            name='FischPictureLikes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('like', models.IntegerField(default=0)),
                ('picture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='like', to='pages.fischpicture')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fisch_picture_likes', to='pages.profile')),
            ],
        ),
    ]
