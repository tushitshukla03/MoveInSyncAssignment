// pages/Login.js

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import loginImage from '../assets/login.jpg'; // Your login image
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/userSlice'; // Import the action to set credentials
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser({
          user: { email },  
          access: data.access,
          refresh: data.refresh,
        }));
        toast.success('Login successful! Redirecting...', {
          position: "top-right",
        });
        setTimeout(() => {
          router.push('/'); 
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(`Login failed: ${data.detail || 'Invalid credentials'}`, {
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
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="flex w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden scale-125">
        {/* Left side (Form) */}
        <div className="w-1/2 p-8 space-y-4" style={{ minHeight: '500px' }}>
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
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
              Login
            </button>
          </form>
          <p className="text-center mt-4">
            Dont have an account?{' '}
            <Link href="/signup" className="text-red-500">
              Sign up
            </Link>
          </p>
        </div>
        {/* Right side (Image) */}
        <div className="w-1/2 relative">
          <Image src={loginImage} alt="Login" layout="fill" objectFit="cover" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
