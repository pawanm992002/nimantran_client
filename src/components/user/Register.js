import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // default role for registration
  const [clientId, setClientId] = useState('');
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
        const user = { username, password, role };
        if (role === 'customer') {
            user.clientId = clientId;
        }
        const {data} = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, user);

        if(!data) {
          toast.error(data.message)
          return
        }
        toast.success(data?.message)
        navigate('/login');

    } catch (error) {
      toast.error(error.response.data.message)
    }
};

  return (
    <div>
      <h2>Register</h2>
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="client">Client</option>
        <option value="customer">Customer</option>
      </select>
      {role === 'customer' && (
        <input
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
      )}
      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default Register;
