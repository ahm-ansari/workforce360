from .views import LoginView
from django.urls import path

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
]
