import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import signupImage from '../assets/login.jpg'; // Add your image file here
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useRouter } from 'next/router'; // Import useRouter for navigation

const Signup = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize the router

  const handleSignup = async (e) => {
    e.preventDefault();

    // Data object to be sent to the API
    const userData = {
      phone_number: phone,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success('Registration successful! Redirecting to login...', {
          position: "top-right",
        });
        setTimeout(() => {
          router.push('/login'); // Redirect to the login page after a delay
        }, 2000);
        setPhone('');
        setEmail('');
        setPassword('');
      } else {
        const data = await response.json();
        toast.error(`Registration failed: ${data.message || 'Something went wrong'}`, {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden scale-125">
        {/* Left side (Form) */}
        <div className="w-1/2 p-8 space-y-4" style={{ minHeight: '500px' }}>
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number:</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-red-500 text-white rounded-lg"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-red-500">
              Log in
            </Link>
          </p>
        </div>
        {/* Right side (Image) */}
        <div className="w-1/2 relative">
          <Image src={signupImage} alt="Signup" layout="fill" objectFit="cover" />
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer to show notifications */}
    </div>
  );
};

export default Signup;
