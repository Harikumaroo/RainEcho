from django.contrib.auth.models import User
from rest_framework import serializers

from .models import SearchHistory, Notification


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long.')
        return value


class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['id', 'city', 'created_at']

    def create(self, validated_data):
        return SearchHistory.objects.create(user=self.context['request'].user, **validated_data)


class WeatherSerializer(serializers.Serializer):
    city = serializers.CharField()
    country = serializers.CharField()
    date_time = serializers.CharField()
    condition = serializers.CharField()
    description = serializers.CharField()
    icon = serializers.CharField()
    is_night = serializers.BooleanField()
    temperature = serializers.FloatField()
    feels_like = serializers.FloatField()
    temp_min = serializers.FloatField()
    temp_max = serializers.FloatField()
    humidity = serializers.IntegerField()
    wind_speed = serializers.FloatField()
    pressure = serializers.IntegerField()
    sunrise = serializers.CharField()
    sunset = serializers.CharField()


class ForecastItemSerializer(serializers.Serializer):
    date = serializers.CharField()
    temperature = serializers.FloatField()
    humidity = serializers.IntegerField()
    wind_speed = serializers.FloatField()
    description = serializers.CharField()
    icon = serializers.CharField()
    condition = serializers.CharField()


class ForecastSerializer(serializers.Serializer):
    city = serializers.CharField()
    country = serializers.CharField()
    forecast = ForecastItemSerializer(many=True)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'alert_type', 'is_read', 'created_at']


