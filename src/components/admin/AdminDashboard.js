import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const createClient = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        toast.error("Enter all Neccessary Fields");
        return;
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_ADMIN}/create-client`,
        { username, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.flag) {
        toast.success(data.message);
        getAllUsers();
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllUsers = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_ADMIN}/getAllClientWihtCustomers`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!data) {
      navigate("/");
      return;
    }
    setUsers(data?.data);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    getAllUsers();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <h2>Create Client</h2>
        <form onSubmit={createClient}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="temp_password">Temporary Password</label>
            <input
              id="temp_password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>

      <table cellPadding={5} cellSpacing={5} border="1px solid black">
        <thead>
          <tr>
            <td>ID</td>
            <td>Username</td>
            <td>Role</td>
            <td>Credits</td>
            <td>No. of Customers</td>
          </tr>
        </thead>
        <tbody>
          {users.map((client) => (
            <>
              <tr key={client._id}>
                <td> {client?._id} </td>
                <td>{client?.username} </td>
                <td>{client?.role} </td>
                <td>{client?.credits} </td>
                <td>{client?.customers?.length} </td>
              </tr>
              <tr>
                {client?.customers?.map((customer) => (
                  <>
                    <td> {customer?._id} </td>
                    <td>{customer?.username} </td>
                    <td>{customer?.role} </td>
                    <td>{customer?.credits} </td>
                    <td> - </td>
                  </>
                ))}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
