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
class BookingDetailSerializer(serializers.ModelSerializer):
    seat = SeatSerializer()
    trip = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = ['id', 'seat', 'user_name', 'booking_price', 'trip']
    
    def get_trip(self, obj):
        trip = obj.seat.trip
        return {
            'date': trip.date,
            'day': trip.date.strftime('%A'),
            'monthYear': trip.date.strftime('%b %Y'),
            'route': f"{trip.route.route_from} – {trip.route.route_to}",
            'company': trip.bus.bus_name,
            'boarding': trip.route.route_name,
            'route_time': trip.route.route_time.strftime('%H:%M'),
            'bus_number': trip.bus.bus_number
        }

class OrderSerializer(serializers.ModelSerializer):
    bookings = BookingDetailSerializer(many=True, read_only=True)
    status = serializers.CharField(source='get_status_display')
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    
    class Meta:
        model = Order
        fields = ['id', 'order_email', 'order_phone_number', 'total_price', 
                 'status', 'created_at', 'bookings']

class TripAvailabilitySerializer(serializers.ModelSerializer):
    bus = BusSerializer() 
    route_name = serializers.CharField(source='route.route_name')
    route_id = serializers.IntegerField(source='route.id')  # Add route_id
    arrival_time = serializers.TimeField(source='route.route_time', read_only=True)
    price = serializers.IntegerField(source='route.route_price', read_only=True)
    all_seats = serializers.SerializerMethodField()

    class Meta:
        model = Trip    
        fields = ['id', 'bus', 'route_name', 'route_id', 'date', 'arrival_time', 'price', 'all_seats']  # Include route_id

    def get_all_seats(self, obj):
        all_seats = Seat.objects.filter(trip=obj)
        return AvailableSeatSerializer(all_seats, many=True).data

