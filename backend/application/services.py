import datetime

import requests
from django.conf import settings
from django.core.mail import send_mail

from .models import Notification

BASE_URL = 'https://api.openweathermap.org/data/2.5'
TIMEOUT = 12


def _build_params(city):
    api_key = getattr(settings, 'OPENWEATHER_API_KEY', '')
    if not api_key:
        raise ValueError('OpenWeatherMap API key is not configured.')
    return {
        'q': city,
        'units': 'metric',
        'appid': api_key,
        'lang': 'en',
    }


def _format_time(timestamp, offset_seconds, fmt='%H:%M'):
    return datetime.datetime.utcfromtimestamp(timestamp + offset_seconds).strftime(fmt)


def _format_date(timestamp, offset_seconds):
    return datetime.datetime.utcfromtimestamp(timestamp + offset_seconds).strftime('%a, %d %b')


def _normalize_current(data):
    weather = data['weather'][0]
    main = data['main']
    sys = data.get('sys', {})
    timezone = data.get('timezone', 0)
    is_night = weather.get('icon', '').endswith('n')

    return {
        'city': data.get('name', ''),
        'country': sys.get('country', ''),
        'date_time': _format_time(data.get('dt', 0), timezone, '%A, %d %b %H:%M'),
        'condition': weather.get('main', 'Clear'),
        'description': weather.get('description', '').title(),
        'icon': f"https://openweathermap.org/img/wn/{weather.get('icon', '01d')}@4x.png",
        'is_night': is_night,
        'temperature': round(main.get('temp', 0.0), 1),
        'feels_like': round(main.get('feels_like', 0.0), 1),
        'temp_min': round(main.get('temp_min', 0.0), 1),
        'temp_max': round(main.get('temp_max', 0.0), 1),
        'humidity': main.get('humidity', 0),
        'pressure': main.get('pressure', 0),
        'wind_speed': round(data.get('wind', {}).get('speed', 0.0), 1),
        'sunrise': _format_time(sys.get('sunrise', 0), timezone),
        'sunset': _format_time(sys.get('sunset', 0), timezone),
    }


def _normalize_forecast(data):
    timezone = data.get('city', {}).get('timezone', 0)
    city_name = data.get('city', {}).get('name', '')
    country = data.get('city', {}).get('country', '')
    chosen = {}

    for item in data.get('list', []):
        local_date = datetime.date.fromtimestamp(item['dt'] + timezone)
        existing = chosen.get(local_date)
        if not existing or item['dt_txt'].endswith('12:00:00'):
            chosen[local_date] = item

    ordered = sorted(chosen.items(), key=lambda value: value[0])[:5]
    forecast = []
    for date, item in ordered:
        weather = item['weather'][0]
        forecast.append({
            'date': _format_date(item['dt'], timezone),
            'temperature': round(item['main']['temp'], 1),
            'humidity': item['main']['humidity'],
            'wind_speed': round(item['wind']['speed'], 1),
            'description': weather.get('description', '').title(),
            'icon': f"https://openweathermap.org/img/wn/{weather.get('icon', '01d')}@2x.png",
            'condition': weather.get('main', 'Clear'),
        })

    return {
        'city': city_name,
        'country': country,
        'forecast': forecast,
    }


def fetch_current_weather(city):
    response = requests.get(f'{BASE_URL}/weather', params=_build_params(city), timeout=TIMEOUT)
    if response.status_code == 404:
        raise ValueError('City not found. Please try a valid location.')
    response.raise_for_status()
    return _normalize_current(response.json())


def fetch_weather_forecast(city):
    response = requests.get(f'{BASE_URL}/forecast', params=_build_params(city), timeout=TIMEOUT)
    if response.status_code == 404:
        raise ValueError('City not found. Please try a valid location.')
    response.raise_for_status()
    return _normalize_forecast(response.json())


def check_extreme_weather(user, weather_data):
    """
    Checks the current weather data for extreme conditions or high temperatures
    and creates notifications and sends emails if needed.
    """
    condition = weather_data.get('condition', '')
    desc = weather_data.get('description', '').lower()
    temp = weather_data.get('temperature', 0)
    city = weather_data.get('city', 'Unknown')
    
    alert_triggered = False
    alert_title = ""
    alert_message = ""
    alert_type = "info"
    
    # 1. Check for simulated extreme conditions
    extreme_conditions = ['Tornado', 'Squall', 'Hurricane', 'Ash', 'Dust', 'Sand']
    if condition in extreme_conditions or 'storm' in desc or 'flood' in desc:
        alert_triggered = True
        alert_title = f"DISASTER ALERT: {condition} Warning in {city}!"
        alert_message = f"Dangerous weather conditions ({desc}) detected in {city}. Please stay indoors and stay safe."
        alert_type = "danger"
    
    # 2. Check for high temperature increase
    elif temp >= 35.0:
        alert_triggered = True
        alert_title = f"High Temperature Alert in {city}!"
        alert_message = f"The temperature in {city} has reached {temp}°C. Please stay hydrated."
        alert_type = "warning"
        
    if alert_triggered:
        # Prevent spamming: only alert if there isn't a similar recent alert in the last 6 hours
        recent_cutoff = datetime.datetime.now() - datetime.timedelta(hours=6)
        recent_alerts = Notification.objects.filter(
            user=user, 
            title=alert_title, 
            created_at__gte=recent_cutoff
        )
        
        if not recent_alerts.exists():
            # Create notification
            Notification.objects.create(
                user=user,
                title=alert_title,
                message=alert_message,
                alert_type=alert_type
            )
            
            # Send Email
            if user.email:
                try:
                    send_mail(
                        subject=f"RainEcho: {alert_title}",
                        message=alert_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=True,
                    )
                except Exception as e:
                    print(f"Failed to send email: {e}")


