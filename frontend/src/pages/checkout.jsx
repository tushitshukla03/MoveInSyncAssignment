import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import Checkout from "../assets/checkout.jpg";
import { useSelector } from 'react-redux'; 
import { selectUser } from '../utils/userSlice'; // Selector to get user details
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function BookingForm() {
  const router = useRouter();
  const [passenger, setPassenger] = useState({
    email: "",
    phone: "",
  });
  const [seats, setSeats] = useState([]);
  const [seatNames, setSeatNames] = useState([]); // State to store names for each seat
  const [bus, setBus] = useState({});
  const user = useSelector(selectUser); // Get user from Redux store

  // Set the passenger email and phone based on the user
  useEffect(() => {
    if (user) {
      setPassenger({
        email: user?.user?.email || "",
        phone: user?.user?.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (router.query.seats && router.query.bus) {
      const seatArray = JSON.parse(router.query.seats);
      setSeats(seatArray);
      setSeatNames(Array(seatArray.length).fill("")); // Initialize seat names
      setBus(JSON.parse(router.query.bus));
    }
  }, [router.query]);

  // Handle change for passenger info (email, phone)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassenger({
      ...passenger,
      [name]: value,
    });
  };

  // Handle change for individual seat names
  const handleSeatNameChange = (index, value) => {
    const updatedSeatNames = [...seatNames];
    updatedSeatNames[index] = value;
    setSeatNames(updatedSeatNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      bus_id: 1,
      route_id: bus.route_id,
      travel_date: bus.date,
      seats: seats.map((seat, index) => ({
        seat_number: seat.seat_number,
        user_name: seatNames[index], // Assign each seat its respective name
      })),
      email: passenger.email,
      phone_number: passenger.phone,
    };

    try {
      const response = await fetch('http://localhost:8000/api/create_booking/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`, // Ensure this is being passed correctly
          },
          body: JSON.stringify(bookingData),
        });
      console.log(bookingData);

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const data = await response.json();
      toast.success('Booking successful!');
      router.push('/mytravel');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center p-6 -mt-5">
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="flex justify-between w-full max-w-3xl bg-white p-10 shadow-md rounded">
        <form className="w-full max-w-3xl" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-2">Passenger Information</h2>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Seat Numbers</label>
            <input
              type="text"
              value={seats.map((seat) => seat.seat_number).join(", ")}
              readOnly
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
            />
          </div>

          {seats.map((seat, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-1 text-gray-600">
                Name for Seat {seat.seat_number}
              </label>
              <input
                type="text"
                value={seatNames[index] || ""}
                onChange={(e) => handleSeatNameChange(index, e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Email ID</label>
            <input
              type="email"
              name="email"
              value={passenger.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Phone</label>
            <input
              type="tel"
              name="phone"
              value={passenger.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Total Amount: ₹{seats.length * bus.price}
            </h2>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            PROCEED TO PAY
          </button>
        </form>
      </div>
      <div className="w-full max-w-lg my-80 rounded shadow-md h-[150px] mx-6 flex items-center justify-center">
        <Image
          src={Checkout}
          alt="Seat Booking"
          className="rounded-md shadow-md"
        />
      </div>
    </div>
  );
}