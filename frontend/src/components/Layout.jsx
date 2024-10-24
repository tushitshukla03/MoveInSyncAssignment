import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  return (
    <div >
      <NavBar />
      <main className='pt-20'>{children}</main>
    </div>
  );
};

export default Layout;
