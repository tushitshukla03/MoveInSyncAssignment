from django.contrib import admin
from .models import Bus, Route, Booking, Seat, Order, Trip

class BusAdmin(admin.ModelAdmin):
    list_display = ['bus_name', 'bus_number', 'bus_capacity', 'days_of_operation']
    search_fields =['bus_name', 'bus_number', 'bus_capacity', 'days_of_operation']
    list_filter = ['bus_name', 'bus_number', 'bus_capacity', 'days_of_operation']
    list_per_page = 10


class RouteAdmin(admin.ModelAdmin):
    list_display = ['route_name', 'route_from', 'route_to', 'route_price', 'route_time']
    search_fields = ['route_name', 'route_from', 'route_to', 'route_price', 'route_time']
    list_filter = ['route_name', 'route_from', 'route_to', 'route_price', 'route_time']
    list_per_page = 10

class SeatAdmin(admin.ModelAdmin):
    list_display = ['seat_number', 'seat_status', 'trip']
    search_fields = ['seat_number', 'seat_status', 'trip']
    list_filter = ['seat_number', 'seat_status', 'trip']
    list_per_page = 10

class BookingAdmin(admin.ModelAdmin):
    list_display = ['seat','booking_price', 'order', 'user_name']
    search_fields = ['seat','booking_price', 'order', 'user_name']
    list_filter =['seat','booking_price', 'order', 'user_name']
    list_per_page = 10

class OrderAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'order_email', 'order_phone_number', 'total_price', 'status', 'created_at']
    search_fields = ['user_id', 'order_email', 'order_phone_number', 'total_price', 'status', 'created_at']
    list_filter = ['user_id', 'order_email', 'order_phone_number', 'total_price', 'status', 'created_at']
    list_per_page = 10

class TripAdmin(admin.ModelAdmin):
    list_display = ['bus', 'route', 'date']
    search_fields = ['bus', 'route', 'date']
    list_filter = ['bus', 'route', 'date']
    list_per_page = 10

admin.site.register(Bus, BusAdmin)
admin.site.register(Route, RouteAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(Seat, SeatAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Trip, TripAdmin)

# Register your models here.
