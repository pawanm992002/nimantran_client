import React, { useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Customer = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const role = localStorage.getItem("role");
  const getLinkClasses = (path) => {
    return location.pathname === path
      ? "bg-blue-500 text-white px-4 py-2 rounded-md"
      : "bg-gray-200 text-gray-700 px-4 py-2 rounded-md";
  };
  const [params] = useSearchParams();
  const customerId = params.get("customerId");
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (location.pathname === `/customer` && customerId) {
  //     navigate(`/customer/profile?customerId=${customerId}`);
  //   }
  // }, [location.pathname, customerId, navigate]);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100">
        <div className="px-4">
          <div className="flex items-center mb-4">
            <img
              className="w-44 cursor-pointer"
              src="/nimantran logo.png"
              alt=""
              onClick={() => navigate("/client/dashboard")}
            />
          </div>
          <nav className="space-y-2 pt-5">
            <Link
              to={`/customer/profile?customerId=${customerId}`}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === `/customer/profile` ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🏠</span> Dashboard
            </Link>

            <Link
              to={`/customer/editProfile?customerId=${customerId}`}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === `/customer/editProfile` ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">👥</span> Edit Profile
            </Link>
            <Link
              to={`/customer/events?customerId=${customerId}`}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/customer/events" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🎊</span> Events
            </Link>
            <Link
              to={`/customer/credits?customerId=${customerId}`}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/customer/credits" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">💲</span> Credits
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-white">
        <header className="flex items-center justify-end mb-6">
          <div className="flex items-center">
            <div className="flex items-center">
              {/* <img className="h-8 w-8 rounded-full mr-2" src="https://via.placeholder.com/32" alt="Profile" /> */}
              <span className="size-8 rounded-full mr-2 bg-slate-400 justify-center items-center flex cursor-pointer">
                P
              </span>
              <div className="h-full flex items-center justify-center">
                <div
                  className="bg-black text-white text-center mx-2 py-2 px-4 rounded-lg cursor-pointer"
                  onClick={() => navigate("/event/createEvent")}
                >
                  Create Event
                </div>
              </div>
              <div className="h-full flex items-center justify-center">
                <div
                  className="bg-black text-white text-center mx-2 py-2 px-4 rounded-lg cursor-pointer"
                >
                  Logout
                </div>
              </div>
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

export default Customer;
