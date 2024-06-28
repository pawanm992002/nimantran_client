import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <>
      <nav className='navbar'>
        <div className="logo">
          <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="Logo" />
        </div>
        <div className="right-section">
          <div className="btn" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
