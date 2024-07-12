import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/AdminLogin.css"; // Ensure you save the CSS in this file

const AdminLogin = () => {
  const [mobile, setmobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_ADMIN}/login`,
        { mobile, password }
      );
      console.log(data);
      if (!data?.token) {
        navigate("/");
        return;
      }
      localStorage.setItem("token", data?.token);
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Error logging in");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-avatar">
        <img
          src="https://png.pngtree.com/png-clipart/20191122/original/pngtree-user-icon-isolated-on-abstract-background-png-image_5192004.jpg"
          alt="Avatar"
        />
      </div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="mobile"
        value={mobile}
        onChange={(e) => setmobile(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginUser}>Login</button>
    </div>
  );
};

export default AdminLogin;
