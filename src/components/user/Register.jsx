import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client'); // default role for registration
    const [clientId, setClientId] = useState('');
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();
        try {
            const user = { mobile, password, role };
            if (role === 'customer') {
                user.clientId = clientId;
            }
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, user);

            if (!data) {
                toast.error(data.message);
                return;
            }
            toast.success(data?.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
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
                    <form onSubmit={registerUser} className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 text-center">Registration</h2>
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
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
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select 
                                id="role"
                                value={role} 
                                onChange={(e) => setRole(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            >
                                <option value="client">Client</option>
                                <option value="customer">Customer</option>
                            </select>
                        </div>
                        {role === 'customer' && (
                            <div>
                                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client ID</label>
                                <input 
                                    type="text" 
                                    id="clientId" 
                                    placeholder="Enter your client ID" 
                                    value={clientId} 
                                    onChange={(e) => setClientId(e.target.value)} 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                />
                            </div>
                        )}
                        <div>
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            >
                                Register
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            Already have an account? 
                            <a href="/login" className="text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"> Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
