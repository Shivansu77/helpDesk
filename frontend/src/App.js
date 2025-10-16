import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'; // Import Tailwind CSS
import { UserProvider } from './context/UserContext';
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketDetails from './pages/TicketDetails';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/user/login" replace />;
}


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/user/login" replace />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
            <Route path="/tickets/edit/:id" element={<ProtectedRoute><EditTicket /></ProtectedRoute>} />
          <Route path="/add-ticket" element={<ProtectedRoute><CreateTicket/></ProtectedRoute>} />


          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
