import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
};

 

 

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

      
    </div>
  );
};

export default AdminDashboard;
