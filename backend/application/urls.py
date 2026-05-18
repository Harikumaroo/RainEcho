from django.urls import path

from .views import (
    ForecastView,
    LoginView,
    LogoutView,
    PasswordResetConfirmView,
    PasswordResetView,
    RegisterView,
    SearchHistoryView,
    NotificationListView,
    WeatherView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('weather/<str:city>/', WeatherView.as_view(), name='weather'),
    path('forecast/<str:city>/', ForecastView.as_view(), name='forecast'),
    path('search-history/', SearchHistoryView.as_view(), name='search-history'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
]
