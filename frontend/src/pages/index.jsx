import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import shield from '../assets/shield.png';
import convinient from '../assets/convenient.png';
import star from '../assets/star.png';
import leaf from '../assets/leaf.png';
import Bus from '../assets/bus.jpg';

const Home = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    onwardDate: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: {
        source: formData.fromLocation,
        destination: formData.toLocation,
        date: formData.onwardDate
      }
    });
  };

  return (
    <div className="flex flex-col -mt-20">
      <div className="relative">
        <div className="relative h-[450px]">
          <Image
            src={Bus}
            alt="Red City Bus"
            layout="fill"
            objectFit="cover"
            className="bg-cover bg-center"
          />
        </div>
        
        <div className="absolute my-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-72 max-w-6xl">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="flex justify-center space-x-4">
              <div className="relative">
                <span className="absolute left-2 top-3 text-xl text-gray-400">
                  <i className="far fa-building"></i>
                </span>
                <input
                  id="fromLocation"
                  className="pl-8 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="text"
                  value={formData.fromLocation}
                  onChange={handleInputChange}
                  required
                  placeholder="From"
                />
              </div>

              <div className="relative">
                <span className="absolute left-2 top-3 text-xl text-gray-400">
                  <i className="far fa-building"></i>
                </span>
                <input
                  id="toLocation"
                  className="pl-8 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="text"
                  value={formData.toLocation}
                  onChange={handleInputChange}
                  required
                  placeholder="To"
                />
              </div>

              <div className="relative">
                <span className="absolute left-2 top-3 text-xl text-gray-400">
                  <i className="fas fa-calendar-alt"></i>
                </span>
                <input
                  id="onwardDate"
                  className="pl-8 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="date"
                  value={formData.onwardDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="bg-red-600 text-white font-semibold px-8 py-2 rounded-lg">
                Search Buses
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 my-16">
        <h2 className="text-2xl font-semibold mb-4">Travel with Confidence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature cards remain the same */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image alt="shield" src={shield} className="w-16 m-auto" />
            <h3 className="text-xl font-bold text-center mb-2">Health and Safety</h3>
            <p>Keep yourself and others safe while traveling with us.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image alt="convenient" src={convinient} className="w-14 m-auto" />
            <h3 className="text-xl font-bold mb-2 text-center">Comfort on board</h3>
            <p>Our buses are equipped with large and comfortable seats, a toilet, Wi-Fi, and power outlets.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image alt="star" src={star} className="w-12 m-auto" />
            <h3 className="text-xl font-bold mb-2 text-center">Satisfied Customers</h3>
            <p>We have transported 100+ million happy customers worldwide. Indian customers give us an amazing 4.5 stars.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image alt="leaf" src={leaf} className="w-12 m-auto" />
            <h3 className="text-xl font-bold mb-2 text-center">The Green Choice</h3>
            <p>MoveInSync is one of the most eco-friendly ways to travel.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;