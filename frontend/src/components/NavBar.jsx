import React from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logoutUser } from '../utils/userSlice'; 
import ticket from '../assets/ticket.png';
import contact from '../assets/contact.png';
import logout from '../assets/logout.png';
import { useRouter } from 'next/router'; 
import profile from '../assets/user.png';
import Link from 'next/link';

const NavBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser); 
  const handleMyTrips = () => {
    if (user?.accessToken) {
      router.push('/mytravel'); 
    } else {
      router.push('/login'); 
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login'); 
  };

  return (
    <nav className="bg-white fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <a className="navbar-brand" href="#">
          <Link href="/" className='text-red-600 font-bold text-xl'>MoveInSync</Link>
        </a>
        <div className="space-x-12 text-black flex">
          <div className='flex'>
            <Image src={ticket} alt="Bus Tickets" className='h-6 w-6 mx-1' />
            <a href="#" onClick={handleMyTrips} className=" hover:underline">My Trips</a>
          </div>
          <div className='flex'>
            <Image src={contact} alt="Contact Us" className='h-6 w-6 mx-1' />
            <a href="#" className=" hover:underline">Contact Us</a>
          </div>
          <div className='flex'>
            {user?.accessToken ? (
              <div className='flex items-center'>
                <div className='flex mr-6'>
                <Image src={profile} alt="Login" className='h-6 w-6 mx-1' />
                <Link href="/profile" className=" hover:underline">Profile</Link>
                </div>
                <div className='flex'>
                <Image src={logout} alt="Login" className='h-6 w-6 mx-1' />
                <button onClick={handleLogout} className="ml-2  hover:underline">
                  Logout
                </button></div>
              </div>
            ) : (
              <><Image src={profile} alt="Login" className='h-6 w-6 mx-1' />
              <a href="/login" className="uppercase hover:underline">Login</a></>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
