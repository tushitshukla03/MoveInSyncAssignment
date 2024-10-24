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
    arrival_time = serializers.TimeField(source='route.route_time', read_only=True)  # Include route time as arrival_time
    price = serializers.IntegerField(source='route.route_price', read_only=True)  # Include route price
    all_seats = serializers.SerializerMethodField()

    class Meta:
        model = Trip    
        fields = ['id', 'bus', 'route', 'date', 'arrival_time', 'price', 'all_seats']  # Add arrival_time and price

    def get_all_seats(self, obj):
        all_seats = Seat.objects.filter(trip=obj)
        return AvailableSeatSerializer(all_seats, many=True).data
