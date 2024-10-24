# booking/serializers.py

from rest_framework import serializers
from .models import Route, Bus, Seat, Booking, Order, Trip

class AvailableSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'seat_status']



class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class TripAvailabilitySerializer(serializers.ModelSerializer):
    bus = BusSerializer() 
    route = serializers.CharField(source='route.route_name')
    all_seats = serializers.SerializerMethodField()

    class Meta:
        model = Trip    
        fields = ['id', 'bus', 'route', 'date', 'all_seats']

    def get_available_seats(self, obj):
        all_seats = Seat.objects.filter(trip=obj)
        return AvailableSeatSerializer(available_seats, many=True).data
