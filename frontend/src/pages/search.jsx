// pages/search.jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import arrow from '../assets/arrow.png';

const BusList = () => {
  const router = useRouter();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState({});

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
        setBuses(data);
        
        // Initialize selected seats state
        const initialSelectedSeats = {};
        data.forEach(bus => {
          initialSelectedSeats[bus.id] = [];
        });
        setSelectedSeats(initialSelectedSeats);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBuses();
  }, [router.isReady, router.query]);

  const getAvailableSeats = (allSeats) => {
    return allSeats.filter(seat => !seat.seat_status).length;
  };

  const getSeatAvailabilityColor = (allSeats) => {
    const totalSeats = allSeats.length;
    const availableSeats = getAvailableSeats(allSeats);
    const occupancyPercentage = ((totalSeats - availableSeats) / totalSeats) * 100;
    
    if (occupancyPercentage <= 60) return 'text-green-500';
    if (occupancyPercentage > 60 && occupancyPercentage <= 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  const toggleSeatSelection = (busId, seatId, seatStatus) => {
    if (seatStatus) return; // If seat is already booked, don't allow selection
    
    setSelectedSeats(prev => {
      const currentSelected = prev[busId] || [];
      const isCurrentlySelected = currentSelected.includes(seatId);
      
      if (isCurrentlySelected) {
        return {
          ...prev,
          [busId]: currentSelected.filter(id => id !== seatId)
        };
      } else {
        return {
          ...prev,
          [busId]: [...currentSelected, seatId]
        };
      }
    });
  };

  const calculateTotalPrice = (busId, price) => {
    const selected = selectedSeats[busId] || [];
    return selected.length * price;
  };

  const SeatSelectionModal = ({ bus, onClose }) => {
    const seatRows = [];
    for (let i = 0; i < bus.all_seats.length; i += 3) {
      seatRows.push(bus.all_seats.slice(i, i + 3));
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold">{bus.bus.bus_name} - Select Seats</h3>
            <button onClick={onClose} className="text-gray-500">&times;</button>
          </div>
          
          <div className="grid gap-4 mb-4">
            {seatRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-4">
                {row.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeatSelection(bus.id, seat.id, seat.seat_status)}
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${seat.seat_status 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : selectedSeats[bus.id]?.includes(seat.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-100'
                      }
                    `}
                    disabled={seat.seat_status}
                  >
                    {seat.seat_number}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p>Selected Seats: {selectedSeats[bus.id]?.length || 0}</p>
                <p>Total Price: ₹{calculateTotalPrice(bus.id, bus.price)}</p>
              </div>
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
                disabled={!selectedSeats[bus.id]?.length}
                onClick={() => {
                  // Handle booking logic here
                  console.log('Booking seats:', selectedSeats[bus.id]);
                  onClose();
                }}
              >
                Book Seats
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [selectedBus, setSelectedBus] = useState(null);

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
            <label><input type="checkbox" className="mr-2" /> After 6 pm</label>
          </div>
        </div>

        <div className="w-3/4">
          {buses.map((bus) => (
            <div key={bus.id} className="border rounded-lg mb-4 p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{bus.bus.bus_name}</h3>
                <p>Bus Number: {bus.bus.bus_number}</p>
                <p>Route: {bus.route}</p>
                <p>Arrival: {bus.arrival_time}</p>
                <p>Date: {bus.date}</p>
                <p className={`text-sm ${getSeatAvailabilityColor(bus.all_seats)}`}>
                  {getAvailableSeats(bus.all_seats)} Seats available
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-bold text-lg mr-8">₹{bus.price}</p>
                <button 
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                  onClick={() => setSelectedBus(bus)}
                >
                  Select Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBus && (
        <SeatSelectionModal
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
        />
      )}
    </div>
  );
};

export default BusList;