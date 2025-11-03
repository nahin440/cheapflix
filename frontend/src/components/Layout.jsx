import React, { useEffect } from 'react'; // Make sure to import useEffect
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  useEffect(() => {
    console.log('App mounted - Checking localStorage:');
    console.log('user:', localStorage.getItem('user'));
    console.log('isAuthenticated:', localStorage.getItem('isAuthenticated'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow">
       <Outlet></Outlet>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;