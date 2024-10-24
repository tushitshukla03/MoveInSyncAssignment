# accounts/urls.py

from django.urls import path
from .views import register_user, account_detail

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('account/', account_detail, name='account_detail')
]
