import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import "../styles/register.css";
import img from "../../images/6131259.jpg";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginUser = async (event) => {
        event.preventDefault(); // Prevents the default form submission
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, { username, password });

            localStorage.setItem('token', data?.data?.token);
            localStorage.setItem('username', data?.data?.username);
            localStorage.setItem('_id', data?.data?._id);
            localStorage.setItem('role', data?.data?.role);

            toast.success(data.message);
            if (data.data.role === 'client') {
                navigate(`/client`);
            } else if (data.data.role === 'customer') {
                navigate('/customer');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div>
            <section>
                <div className="container">
                    <div className="imgBx"><img src={img} alt=""/></div>
                </div>
                <div className="formBx">
                    <form onSubmit={loginUser}>
                        <h2>Login</h2>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            placeholder="Password"  
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <input type="submit" value="Login" />
                        <p className="signup">
                            Don't have an account?
                            <a href="#">Register Now</a>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
