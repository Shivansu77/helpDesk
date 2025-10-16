import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { user } = useContext(UserContext);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/user/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-lg font-bold hover:text-blue-200">
          HelpDesk
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4 hidden md:flex items-center">
          {token ? (
            <>
              <span className="text-blue-200">Hi, {user?.name || 'User'}</span>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/add-ticket" className="hover:underline">NewTicket</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/user/login" className="hover:underline">Login</Link>
              <Link to="/user/register" className="hover:underline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
