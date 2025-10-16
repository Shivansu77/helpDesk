import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    role: 'user'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : undefined,
      };

      console.log('Attempting registration with:', { email: payload.email, role: payload.role });
      const response = await axios.post('https://help-desk-f75w0dmof-shivansu77s-projects.vercel.app/user/register', payload);
      console.log('Registration response:', response.data);
      
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/user/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 400) {
        setError(error.response.data.message || 'Registration failed');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <input
              type="number"
              name="age"
              placeholder="Age (optional)"
              value={form.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="8"
              title="Password must be at least 8 characters long"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white transition duration-150 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-blur-500 
                        ${loading
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-black-700 hover:from-red-600 hover:to-red-800 active:scale-95'
              }`}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?
          <Link to="/user/login" className="text-blue-600 hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
