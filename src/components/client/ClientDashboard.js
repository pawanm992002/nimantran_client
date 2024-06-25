import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ClientDashboard = () => {
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [credits, setCredits] = useState(0);
  const [clientInfo, setClientInfo] = useState({});
  const [admincredits, setAdmincredits] = useState(0)

  const fetchClientDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClientInfo(data?.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, []);

  const RequestCreditsFromAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/purchase-request-from-admin`,
        { credits: parseInt(admincredits) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // if(data) {
      //   toast.success("New Customer Added Successfully")
      //   fetchClientDetails();
      // }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

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

  const transferCredits = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/transfer-credits`,
        { customerId, credits: parseInt(credits) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Credits transferred");
      fetchClientDetails();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Client Dashboard</h2>
      <div>
        <h5>
          {clientInfo?.role?.toUpperCase()} ID: {clientInfo?._id?.toUpperCase()}{" "}
        </h5>
        <h5>
          {clientInfo?.role?.toUpperCase()} Username: {clientInfo?.username}{" "}
        </h5>
        <h5>
          {clientInfo?.role?.toUpperCase()} Credits {clientInfo?.credits}{" "}
        </h5>
      </div>
      <form onSubmit={createCustomer}>
        <h2>Create New Customer</h2>
        <div>
          <label htmlFor="username">Enter Customer Username</label>
          <input
            id="username"
            type="text"
            placeholder="Customer Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Enter Customer Username</label>

          <input
            id="password"
            type="password"
            placeholder="Customer Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Create Customer</button>
      </form>

      <form onSubmit={transferCredits}>
        <h2>Transfer Credit To Particular Customer</h2>
        <div>
          <label htmlFor="cust_id">Enter Customer Username</label>
          <select onChange={(e) => setCustomerId(e.target.value)}>
            {clientInfo?.customers?.map((customer) => (
              <option value={customer?._id}>{customer?._id}</option>
            ))}
          </select>
          {/* <input
            id="cust_id"
            type="text"
            placeholder="Customer ID"
            value={customerId}
            
          /> */}
        </div>
        <div>
          <label htmlFor="password">Credits to Transfer</label>

          <input
            type="number"
            placeholder="Credits"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
        </div>
        <button type="submit">Transfer Credits</button>
      </form>

      <form onSubmit={RequestCreditsFromAdmin}>
        <h2>Purchase Credit From Admin</h2>

        <div>
          <label htmlFor="password">Enter Credit for Request</label>

          <input
            type="number"
            placeholder="Credits"
            value={admincredits}
            onChange={(e) => setAdmincredits(e.target.value)}
          />
        </div>
        <button type="submit">Request Credits From Admin</button>
      </form>

      <h3>My Customers</h3>
      <table cellPadding={5} cellSpacing={5} border="1px solid black">
        <thead>
          <tr>
            <td>ID</td>
            <td>username</td>
            <td>credits</td>
          </tr>
        </thead>
        <tbody>
          {clientInfo?.customers?.map((customer) => (
            <tr key={customer._id}>
              <td> {customer._id} </td>
              <td>{customer.username} </td>
              <td>{customer.credits} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientDashboard;
