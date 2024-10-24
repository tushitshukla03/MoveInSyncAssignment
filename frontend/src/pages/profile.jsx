import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../utils/userSlice'; // Adjust the import based on your file structure

export default function Profile() {
  const user = useSelector(selectUser); // Get the user from the Redux store

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-row p-4 max-w-6xl mx-auto">
        <div className="w-3/4 bg-white rounded-lg shadow p-6 m-auto">

          <div className="mt-6">
            <h3 className="text-lg font-bold">Contact Details</h3>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-gray-700">Email ID</label>
                <input
                  type="email"
                  value={user?.email || 'tushit.shukla03@gmail.com'} // Use email from the user object
                  className="mt-2 p-3 border border-gray-300 rounded w-full"
                  disabled
                />
              </div>

              <div>
                <label className="block text-gray-700">Mobile Number</label>
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    value="+91"
                    className="p-3 border border-gray-300 rounded w-16"
                    disabled
                  />
                  <input
                    type="text"
                    value={user?.phone || '9328089209'} // Use phone from the user object
                    className="p-3 border border-gray-300 rounded flex-grow"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
