import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const loginUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, { mobile, password });
    
            // Check if response data is null
            if (!response?.data) {
                toast.error("No response data received");
                return;
            }
    
            const { data } = response.data;
    
            // Check if login was successful
            if (response.status !== 200 || !data) {
                toast.error(response.data.message || "Login failed");
                return;
            }
    
            // Store user details in local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('mobile', data.mobile);
            localStorage.setItem('_id', data._id);
            localStorage.setItem('role', data.role);
    
            toast.success(response.data.message);
    
            // Navigate based on user role
            if (data.role === 'client') {
                navigate(`/client/dashboard`);
            } else if (data.role === 'customer') {
                navigate('/customer');
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                toast.error(error.response.data.message || "An error occurred");
            } else if (error.request) {
                // Request was made but no response received
                toast.error("No response received from server");
            } else {
                // Something happened in setting up the request
                toast.error("An error occurred while setting up the request");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
                <div className="flex justify-center mt-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-400">Logo</span>
                    </div>
                </div>
                <div className="p-8">
                    <form onSubmit={loginUser} className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 text-center">Login</h2>
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                            <input 
                                type="text" 
                                id="mobile" 
                                placeholder="Enter your mobile number" 
                                value={mobile} 
                                onChange={(e) => setMobile(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Enter your password"  
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            />
                        </div>
                        <div>
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            >
                                Login
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            Don't have an account? 
                            <a href="#" className="text-blue-400 hover:text-blue-600 transition duration-150 ease-in-out"> Register Now</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
