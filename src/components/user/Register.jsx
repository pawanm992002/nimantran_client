import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
const Register = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ mobile: '', password: '' });
    const [role, setRole] = useState('client'); // default role for registration
    const [clientId, setClientId] = useState('');
    const [togglePassword, settogglePassword] = useState(false)

    const navigate = useNavigate();
    const handleKeyPress = (event) => {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
        }
    };
    const handleMobileChange = (e) => {
        const mobileRegex = /^\d{10}$/;
        const isValid = mobileRegex.test(e.target.value);

        if (isValid) {
            setMobile(e.target.value);
            setError((prevError) => ({ ...prevError, mobile: '' }));
        } else {
            setMobile(e.target.value);
            setError((prevError) => ({ ...prevError, mobile: 'Not a valid mobile number' }));
        }
    };

    const validatePassword = (value) => {
        if (value.length < 6) {
            setError((prevError) => ({ ...prevError, password: 'Password must be at least 6 characters long' }));
        } else {
            setError((prevError) => ({ ...prevError, password: '' }));
        }
    };

    const registerUser = async (event) => {
        event.preventDefault();
        if (error.mobile || error.password) {
            return; // Exit the function if there are errors
        }
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
                                inputMode='numeric'
                                id="mobile"
                                placeholder="Enter your mobile number"
                                value={mobile}
                                onChange={(e) => handleMobileChange(e)}
                                onKeyPress={handleKeyPress}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            />
                            {error.mobile && <p className="text-red-500 text-sm mt-1">{error.mobile}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className=' relative'>
                                <input
                                    type={`${togglePassword ? "text" : "password"}`}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}

                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${error.password ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
                                        } sm:text-sm transition duration-150 ease-in-out`}
                                />
                                <span className=' absolute bottom-2 right-2.5 cursor-pointer text-blue-500' onClick={() => settogglePassword(prev => !prev)}>{togglePassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}</span>
                            </div>
                            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
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
