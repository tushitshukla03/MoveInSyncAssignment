# booking/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RouteViewSet, BusViewSet, SeatViewSet, BookingViewSet, OrderViewSet
from .views import create_booking, available_trips , get_user_trips, cancel_booking

router = DefaultRouter()
router.register(r'routes', RouteViewSet)
router.register(r'buses', BusViewSet)
router.register(r'seats', SeatViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'orders', OrderViewSet, basename='order')


urlpatterns = [
    path('', include(router.urls)),
    path('create_booking/', create_booking, name='create_booking'),
    path('trips/', available_trips, name='available_trips'),
    path('user-trips/', get_user_trips, name='user-trips'),
    path('orders/<int:order_id>/cancel/', cancel_booking, name='cancel-booking'),
]
