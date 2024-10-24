# booking/views.py

from rest_framework import viewsets
from .models import Route, Bus, Seat, Booking, Order
from .serializers import RouteSerializer, BusSerializer, SeatSerializer, BookingSerializer, OrderSerializer, TripAvailabilitySerializer
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from .models import Bus, Seat, Booking, Order
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny




@api_view(['POST'])
def create_booking(request):
    user = request.user
    bus_id = request.data.get('bus_id')
    route_id = request.data.get('route_id')
    travel_date = request.data.get('travel_date')
    seats_to_book = request.data.get('seats')  # List of dictionaries with seat_number and user_name
    order_email = request.data.get('email')
    order_phone_number = request.data.get('phone_number')

    if not seats_to_book or not travel_date:
        return Response({'error': 'Seats and travel date are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        bus = Bus.objects.get(id=bus_id)
        route = Route.objects.get(id=route_id)
    except (Bus.DoesNotExist, Route.DoesNotExist):
        return Response({'error': 'Bus or route not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        trip = Trip.objects.get(bus=bus, route=route, date=travel_date)
    except Trip.DoesNotExist:
        return Response({'error': 'No scheduled trip found for the selected bus, route, and date'}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Start a database transaction to ensure all-or-nothing operations
        with transaction.atomic():
            total_price = 0
            bookings = []

            # Create an order for the user
            order = Order.objects.create(
                user=user,
                order_email=order_email,
                order_phone_number=order_phone_number,
                total_price=0,
                status='Pending'
            )

            for seat_info in seats_to_book:
                seat_number = seat_info.get('seat_number')
                user_name = seat_info.get('user_name')

                if not seat_number or not user_name:
                    return Response({'error': 'Each seat must have a seat number and user name'}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    seat = Seat.objects.get(trip=trip, seat_number=seat_number)
                except Seat.DoesNotExist:
                    return Response({'error': f'Seat {seat_number} not found for the selected trip'}, status=status.HTTP_404_NOT_FOUND)

                if seat.seat_status:
                    return Response({'error': f'Seat {seat_number} is already booked for the selected date'}, status=status.HTTP_400_BAD_REQUEST)

                seat.seat_status = True
                seat.save()

                total_price += route.route_price

                booking = Booking(
                    seat=seat,
                    order=order,
                    user_name=user_name,
                    booking_price=route.route_price
                )

                bookings.append(booking)

            order.total_price = total_price
            order.status = 'Confirmed'
            order.save()

            Booking.objects.bulk_create(bookings)

            return Response({'message': 'Booking successful', 'order_id': order.id}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def available_trips(request):
    source = request.query_params.get('source')
    destination = request.query_params.get('destination')
    travel_date = request.query_params.get('travel_date')

    # Validate required parameters
    if not source or not destination or not travel_date:
        return Response({'error': 'Source, destination, and travel date are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        routes = Route.objects.filter(route_from=source, route_to=destination)
        if not routes.exists():
            return Response({'error': 'No routes found for the given source and destination'}, status=status.HTTP_404_NOT_FOUND)

        trips = Trip.objects.filter(route__in=routes, date=travel_date)

        if not trips.exists():
            return Response({'error': 'No trips found for the given criteria'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TripAvailabilitySerializer(trips, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
        

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer

class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(order__user=self.request.user)