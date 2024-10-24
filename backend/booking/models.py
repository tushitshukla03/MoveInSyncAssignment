from django.db import models
from accounts.models import Account

BOOKING_STATUS = [
    ('Pending', 'Pending'),
    ('Confirmed', 'Confirmed'),
    ('Cancelled', 'Cancelled'),
]

class Route(models.Model):
    route_name = models.CharField(max_length=100)
    route_from = models.CharField(max_length=100)
    route_to = models.CharField(max_length=100)
    route_price = models.IntegerField()
    route_time = models.TimeField()

    def __str__(self):
        return f"{self.route_name} - {self.route_from} to {self.route_to}"


class Bus(models.Model):
    bus_name = models.CharField(max_length=100)
    bus_number = models.CharField(max_length=100)
    bus_capacity = models.IntegerField()
    days_of_operation = models.CharField(max_length=100)  # Comma-separated days like "Mon, Tue, Wed"

    def __str__(self):
        return f"{self.bus_name} - {self.bus_number}"


class Trip(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    date = models.DateField()  # Represents the specific date for the trip

    def __str__(self):
        return f"Trip for {self.bus.bus_name} on {self.date}"


class Seat(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    seat_number = models.IntegerField()
    seat_status = models.BooleanField(default=False)

    class Meta:
        unique_together = ('trip', 'seat_number')

    def __str__(self):
        return f"Seat {self.seat_number} on Trip {self.trip}"


class Order(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    order_email = models.EmailField(max_length=100)
    order_phone_number = models.CharField(max_length=15)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=BOOKING_STATUS)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.email}"


class Booking(models.Model):
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='bookings')
    user_name = models.CharField(max_length=100)  
    booking_price = models.IntegerField()

    def __str__(self):
        return f"Booking for Seat {self.seat.seat_number} on Trip {self.seat.trip}"
