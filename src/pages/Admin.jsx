import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";


const Admin = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  useEffect(()=>{
     const role = localStorage.getItem('role');
     const token = localStorage.getItem('token');
     if(role == null || token == null){
      navigate('/adminLogin');
     }
  },[])

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100">
        <div className="px-4">
          <div className="flex items-center mb-4">
            <img className="w-full pt-4 object-contain" src="/nimantran logo.png" alt="" />
          </div>
          <nav className="space-y-2 pt-5">
            <Link
              to="/admin/dashboard"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/dashboard" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🏠</span> Dashboard
            </Link>

            <Link
              to="/admin/userDetails"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/userDetails" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">👥</span> Users
            </Link>
            <Link
              to="/admin/eventlist"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/eventlist" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🎊</span> Events
            </Link>
            <Link
              to="/admin/credits"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/credits" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">💲</span> Credits
            </Link>
            <Link
              to="/admin/reports"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/reports" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">📊</span> Reports
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-white">
        <header className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-xl w-1/3"
          />
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full mr-2"
                src="https://via.placeholder.com/32"
                alt="Profile"
              />
              <span>Nimantran</span>
            </div>
          </div>
        </header>
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-[80vh]">
          {/* components */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Admin;
