# Generated migration for TemperatureAlert model

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('application', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TemperatureAlert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city', models.CharField(max_length=180)),
                ('max_temp', models.FloatField(help_text='Maximum temperature threshold in Celsius')),
                ('min_temp', models.FloatField(help_text='Minimum temperature threshold in Celsius')),
                ('enable_email', models.BooleanField(default=True, help_text='Send email notifications')),
                ('enable_website', models.BooleanField(default=True, help_text='Show website alerts')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('last_alert_sent', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='temperature_alerts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('user', 'city')},
            },
        ),
    ]
