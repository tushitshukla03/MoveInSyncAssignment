import React, { useState, useEffect } from 'react';
import shield from '../assets/shield.png'
import convinient from '../assets/convenient.png'
import star from '../assets/star.png'
import leaf from '../assets/leaf.png'
import Bus from '../assets/bus.jpg'


import Image from 'next/image';
const Home = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromOptions, setFromOptions] = useState(['Gurgaon', 'Delhi', 'Jaipur']);
  const [toOptions, setToOptions] = useState(['Gurgaon', 'Delhi', 'Jaipur']);
  const [onwardDate, setOnwardDate] = useState('');

  useEffect(() => {
    if (fromLocation) {
      const filteredToOptions = toOptions.filter(option => option !== fromLocation);
      setToOptions(filteredToOptions);
    } else {
      setToOptions(['Gurgaon', 'Delhi', 'Jaipur']);
    }
  }, [fromLocation]);

  return (
    <div className="flex flex-col -mt-20">
      <div className="relative ">
      <div className="relative h-[450px]">
      <Image
        src={Bus}
        alt="Red City Bus"
        layout="fill" // Fills the parent container
        objectFit="cover" // Ensures the image covers the area
        className="bg-cover bg-center" // Optional if you want to maintain additional styles
      />
    </div>
      
        <div className="absolute my-24  left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-72 max-w-6xl ">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <form className="flex justify-center space-x-4">
              <div className="relative">
                <span className="absolute left-2 top-3 text-xl text-gray-400"><i className="far fa-building"></i></span>
                <input
                  id="input-label-from"
                  className="pl-8 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="text"
                  list="input-from-list"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  required
                />
                <label className={`absolute left-7 top-2 transition-all duration-200 ease-in-out text-gray-500 ${fromLocation ? 'transform -translate-y-6 text-xs' : 'translate-y-0'}`}>
                  FROM
                </label>
                <datalist id="input-from-list">
                  {fromOptions.map((option, idx) => (
                    <option key={idx} value={option}></option>
                  ))}
                </datalist>
              </div>

              <div className="relative">
                <span className="absolute left-2 top-3 text-xl text-gray-400"><i className="far fa-building"></i></span>
                <input
                  id="input-label-to"
                  className="pl-8 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="text"
                  list="input-to-list"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  required
                />
                <label className={`absolute left-7 top-2 transition-all duration-200 ease-in-out text-gray-500 ${toLocation ? 'transform -translate-y-6 text-xs' : 'translate-y-0'}`}>
                  TO
                </label>
                <datalist id="input-to-list">
                  {toOptions.map((option, idx) => (
                    <option key={idx} value={option}></option>
                  ))}
                </datalist>
              </div>

              <div className="relative">
                <span className="absolute left-2 top-3 text-xl text-gray-400"><i className="fas fa-calendar-alt"></i></span>
                <input
                  id="input-label-onward-date"
                  className="pl-8 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="date"
                  value={onwardDate}
                  onChange={(e) => setOnwardDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="bg-red-600 text-white font-semibold px-8 py-2 rounded-lg">Search Buses</button>
            </form>
          </div>
        </div>
      </div>

      {/* Additional sections can be converted similarly */}
      <div className="container mx-auto p-6 my-16">
      <h2 className="text-2xl font-semibold mb-4">Travel with Confidence</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Health and Safety */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <Image alt="shield" src={shield} className="w-16 m-auto" />
        <h3 className="text-xl font-bold text-center mb-2">Health and Safety</h3>
          <p>Keep yourself and others safe while traveling with us.</p>
        </div>

        {/* Card 2: Comfort on Board */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <Image alt="shield" src={convinient} className="w-14 m-auto" />

          <h3 className="text-xl font-bold mb-2 text-center">Comfort on board</h3>
          <p>Our buses are equipped with large and comfortable seats, a toilet, Wi-Fi, and power outlets.</p>
        </div>

        {/* Card 3: Satisfied Customers */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <Image alt="shield" src={star} className="w-12 m-auto" />

          <h3 className="text-xl font-bold mb-2 text-center">Satisfied Customers</h3>
          <p>We have transported 100+ million happy customers worldwide. Indian customers give us an amazing 4.5 stars.</p>
        </div>

        {/* Card 4: The Green Choice */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <Image alt="shield" src={leaf} className="w-12 m-auto" />

          <h3 className="text-xl font-bold mb-2 text-center">The Green Choice</h3>
          <p>MoveInSync is one of the most eco-friendly ways to travel.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
