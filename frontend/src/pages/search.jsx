import React from 'react';
import arrow from '../assets/arrow.png';
import Image from 'next/image';

const BusList = () => {
  const buses = [
    {
      name: 'Babu Travels',
      type: 'Bharat Benz A/C Sleeper (2+1)',
      departure: '21:45',
      duration: '10h 35m',
      arrival: '08:20',
      date: '26-Oct',
      rating: 4.0,
      reviews: 401,
      fare: 1999,
      seatsAvailable: 3,
      totalSeats: 30
    },
    {
      name: 'Jai Shrinath Ji Ki Travels',
      type: 'NON A/C Sleeper (2+1)',
      departure: '21:45',
      duration: '10h 00m',
      arrival: '07:45',
      date: '26-Oct',
      rating: 3.8,
      reviews: 262,
      fare: 1000,
      seatsAvailable: 21,
      totalSeats: 35
    },
    {
      name: 'Samreen Travels',
      type: 'A/C Sleeper (2+1)',
      departure: '21:30',
      duration: '10h 35m',
      arrival: '08:05',
      date: '26-Oct',
      rating: 3.7,
      reviews: 347,
      fare: 1800,
      seatsAvailable: 5,
      totalSeats: 30
    },
  ];

  const getSeatAvailabilityColor = (seatsAvailable, totalSeats) => {
    const occupancy = ((totalSeats - seatsAvailable) / totalSeats) * 100;
    
    if (occupancy <= 60) return 'text-green-500'; // Green if 60% or less
    if (occupancy > 60 && occupancy <= 90) return 'text-yellow-500'; // Yellow if 60% - 90%
    return 'text-red-500'; // Red if 90% - 100%
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start justify-between my-4">
          <hr className="w-[80vw] border-gray-300 py-2" />
          <div className="flex py-2 mb-2">
            <p className="font px-2">Ahmedabad</p>
            <span>
              <Image alt="arrow" className="h-4 w-4 mt-1" src={arrow} />
            </span>
            <p className="px-2">Kota (Rajasthan) Bus</p>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs ml-4">Modify</button>
          </div>
          <hr className="w-full border-gray-300" />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-1/4 bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Filters</h2>
          <h3 className="font-bold mt-4">Departure Time</h3>
          <div className="flex flex-col">
            <label><input type="checkbox" className="mr-2" /> After 10 pm (3)</label>
          </div>
          <div className="flex flex-col">
            <label><input type="checkbox" className="mr-2" /> After 6 pm (8)</label>
          </div>
        </div>

        <div className="w-3/4">
          {buses.map((bus, index) => (
            <div key={index} className="border rounded-lg mb-4 p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{bus.name}</h3>
                <p>{bus.type}</p>
                <p>Departure: {bus.departure} | Duration: {bus.duration} | Arrival: {bus.arrival}</p>
                <p>Date: {bus.date}</p>
                <p className={`text-sm ${getSeatAvailabilityColor(bus.seatsAvailable, bus.totalSeats)}`}>
                  {bus.seatsAvailable} Seats available
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-bold text-lg mr-8">₹{bus.fare}</p>
                <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg">View Seats</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusList;
