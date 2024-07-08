import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <nav className="w-full bg-blue-500 h-16 flex justify-between items-center fixed top-0 left-0 right-0">
        <div className="h-10 w-10 bg-black rounded-full m-2">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Logo"
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="h-full flex items-center justify-center">
          <div
            className="bg-black text-white text-center mx-2 py-2 px-4 rounded-lg cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
