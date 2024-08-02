import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUserGroup,
  faCalendarDay,
  faCoins,
  faSquarePollVertical
} from "@fortawesome/free-solid-svg-icons";
const Client = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  //   const
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (role == null || token == null) {
      navigate("/login");
    }
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <aside className="w-48  border-r-[1px] border-gray-200">
        <div className="px-4">
          <div className="flex items-center mb-4">
            <img className="w-44 cursor-pointer" src="/nimantran logo.png" alt="" onClick={() => navigate('/client/dashboard')} />
          </div>
          <nav className="space-y-2 pt-5">
            <Link
              to="/client/dashboard"
              className={`flex items-center justify-start gap-x-2 px-4 py-1 rounded-md ${currentPath === "/client/dashboard" ? "bg-blue-100 text-blue-500" : "text-gray-500/90"
                }`}
            >
              <FontAwesomeIcon icon={faHouse} /><p>Dashboard</p>
            </Link>

            <Link
              to="/client/customers"
              className={`flex items-center justify-start gap-x-2 px-4 py-1 rounded-md ${currentPath === "/client/customers" ? "bg-blue-100 text-blue-500" : "text-gray-500/90"
                }`}
            >
              <FontAwesomeIcon icon={faUserGroup} /><p>End Users</p>
            </Link>
            <Link
              to="/client/eventlist"
              className={`flex items-center justify-start gap-x-2 px-4 py-1 rounded-md ${currentPath === "/client/eventlist" ? "bg-blue-100 text-blue-500" : "text-gray-500/90"
                }`}
            >
              <FontAwesomeIcon icon={faCalendarDay} /><p>Event</p>

            </Link>
            <Link
              to="/client/credits"
              className={`flex items-center justify-start gap-x-2 px-4 py-1 rounded-md ${currentPath === "/client/credits" ? "bg-blue-100 text-blue-500" : "text-gray-500/90"
                }`}
            >
              <FontAwesomeIcon icon={faCoins} /><p>Credits</p>

            </Link>
            <Link
              to="/client/reports"
              className={`flex items-center justify-start gap-x-2 px-4 py-1 rounded-md ${currentPath === "/client/reports" ? "bg-blue-100 text-blue-500" : "text-gray-500/90"
                }`}
            >
              <FontAwesomeIcon icon={faSquarePollVertical} /><p>Reports</p>

            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 py-2 ">
        <header className="flex items-center justify-end pb-2 border-b-2 border-gray-200 shadow-sm">

          <div className="flex items-center">
            <div className="flex items-center">
              {/* <img className="h-8 w-8 rounded-full mr-2" src="https://via.placeholder.com/32" alt="Profile" /> */}
              <span className="size-6 rounded-full mr-2 bg-slate-400 justify-center items-center flex text-sm font-semibold">
                P
              </span>
              <div className="h-full flex items-center justify-center">
                <div
                  className="bg-blue-500 text-white text-center mx-2 py-1 px-4 rounded-lg cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="  rounded-lg h-[80vh]">
          {/* components */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Client;
