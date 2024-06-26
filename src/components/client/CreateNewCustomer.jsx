import React, { useState } from 'react';
import "./styles/CreateNewCustomer.css";
import axios from 'axios';
import toast from 'react-hot-toast';


const CreateNewCustomer = ({fetchClientDetails , handleModalCreateCustomer}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const createCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/create-customer`,
        { username, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data) {
        toast.success("New Customer Added Successfully");
        fetchClientDetails();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
   
  return (
    <div className="modal-overlay">
      <div className="modal-container">
      <h1 className='close-btn' onClick={()=>handleModalCreateCustomer()}>❌</h1>
        <form onSubmit={createCustomer}>
          <h2>Create New Customer</h2>
          <div className="form-group">
            <label htmlFor="username">Enter Customer Username</label>
            <input
              id="username"
              type="text"
              placeholder="Customer Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Enter Customer Password</label>
            <input
              id="password"
              type="password"
              placeholder="Customer Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit">Create Customer</button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewCustomer;
