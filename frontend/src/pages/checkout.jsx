import { useState } from "react";
import Checkout  from "../assets/checkout.jpg";
import Image from "next/image";
export default function BookingForm() {
  const [passenger, setPassenger] = useState({
    name: "",
    age: "",
    gender: "",
    residence: "",
    email: "",
    phone: "",
    gst: false,
    whatsappUpdates: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPassenger({
      ...passenger,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(passenger);
  };

  return (
    <div className="flex justify-center p-6 -mt-5">
      <div className="flex justify-between w-full max-w-3xl bg-white p-10 shadow-md rounded">
        <form className="w-full max-w-3xl" onSubmit={handleSubmit}>
          {/* Passenger Information */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Passenger Information</h2>
            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Seat</label>
              <input
                type="text"
                value="D7"
                readOnly
                className="w-full border px-3 py-2 rounded-md bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={passenger.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div className="flex mb-4">
              <div className="mr-2 w-1/2">
                <label className="block mb-1 text-gray-600">Gender</label>
                <div className="flex">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={passenger.gender === "Male"}
                      onChange={handleChange}
                    />
                    <span className="ml-1">Male</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={passenger.gender === "Female"}
                      onChange={handleChange}
                    />
                    <span className="ml-1">Female</span>
                  </label>
                </div>
              </div>
              <div className="ml-2 w-1/2">
                <label className="block mb-1 text-gray-600">Age</label>
                <input
                  type="number"
                  name="age"
                  value={passenger.age}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-600">State of Residence</label>
              <input
                type="text"
                name="residence"
                value={passenger.residence}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
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
              <div className="flex">
                <span className="flex items-center border border-r-0 px-3 py-2 bg-gray-100">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={passenger.phone}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-r-md"
                />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Total Amount: INR 1799.00</h2>
            <p className="text-sm text-gray-500">*Exclusive of Taxes</p>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            PROCEED TO PAY
          </button>
        </form>

        
      </div>
      <div className="w-full max-w-lg  my-80 rounded shadow-md h-[150px] mx-6 flex items-center justify-center">
      <Image
        src={Checkout}
        alt="Seat Booking"
        className="rounded-md shadow-md"
      />
    </div>
    </div>
  );
}
