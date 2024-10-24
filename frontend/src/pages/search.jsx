import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import arrow from '../assets/arrow.png';

const BusList = () => {
  const router = useRouter();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuses = async () => {
      if (!router.isReady) return;

      const { source, destination, date } = router.query;
      
      try {
        const response = await fetch(
          `http://localhost:8000/api/trips/?source=${source}&destination=${destination}&travel_date=${date}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch bus data');
        }
        
        const data = await response.json();
        console.log(data)
        setBuses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBuses();
  }, [router.isReady, router.query]);

  const getSeatAvailabilityColor = (seatsAvailable, totalSeats) => {
    const occupancy = ((totalSeats - seatsAvailable) / totalSeats) * 100;
    if (occupancy <= 60) return 'text-green-500';
    if (occupancy > 60 && occupancy <= 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start justify-between my-4">
          <hr className="w-[80vw] border-gray-300 py-2" />
          <div className="flex py-2 mb-2">
            <p className="px-2">{router.query.source}</p>
            <span>
              <Image alt="arrow" className="h-4 w-4 mt-1" src={arrow} />
            </span>
            <p className="px-2">{router.query.destination}</p>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs ml-4"
              onClick={() => router.push('/')}
            >
              Modify
            </button>
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
                <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg">
                  View Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusList;
