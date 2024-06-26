import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginUser = async () => {
        try {
            const {data} = await axios.post(`${process.env.REACT_APP_ADMIN}/login`, { username, password });

            if(!data?.token)  {
                navigate('/')
                return
            }
            
            localStorage.setItem('token', data?.token);
            navigate('/admin')
            
        } catch (error) {
            console.error(error);
            alert('Error logging in');
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={loginUser}>Login</button>
        </div>
    );
};

export default AdminLogin;
