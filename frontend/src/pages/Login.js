import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login(){
    const [form, setForm] = useState({email: '', password: ''});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    
    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            console.log('Attempting login with:', { email: form.email });
            const response = await axios.post('https://help-desk-f75w0dmof-shivansu77s-projects.vercel.app/user/login', form);
            console.log('Login response:', response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            if (error.response?.status === 400) {
                setError(error.response.data.message || 'Invalid email or password');
            } else if (error.response?.status >= 500) {
                setError('Server error. Please try again later.');
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                setError('Cannot connect to server. Please check your internet connection.');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };  
    
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            type="password" 
                            name="password"
                            placeholder="Password" 
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                
                <p className="text-center mt-4 text-gray-600">
                    Don't have an account? 
                    <Link to="/user/register" className="text-blue-600 hover:underline ml-1">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default Login;