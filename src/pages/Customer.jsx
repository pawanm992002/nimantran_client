import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Customer = () => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const getLinkClasses = (path) => {
    return location.pathname === path
      ? "bg-blue-500 text-white px-4 py-2 rounded-md"
      : "bg-gray-200 text-gray-700 px-4 py-2 rounded-md";
  };
  const [params] = useSearchParams();
  const customerId = params.get("customerId");
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === `/customer` && customerId) {
      navigate(`/customer/profile?customerId=${customerId}`);
    }
  }, [location.pathname, customerId, navigate]);

  return (
    <div className="bg-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-semibold">End User Details</h1>
        <Link to={role=="client"?'/client/dashboard':'/admin/dashboard'}className="text-blue-500">&larr; Back</Link>
      </div>
      <div className="flex space-x-4 m-8 gap-10 justify-center">
        <Link to={`/customer/profile?customerId=${customerId}`} className={getLinkClasses(`/customer/profile`)}>
          Profile
        </Link>
        <Link to={`/customer/editProfile?customerId=${customerId}`} className={getLinkClasses(`/customer/editProfile`)}>
          Edit Profile
        </Link>
        <Link to={`/customer/events?customerId=${customerId}`} className={getLinkClasses(`/customer/events`)}>
          Events
        </Link>
        <Link to={`/customer/credits?customerId=${customerId}`} className={getLinkClasses(`/customer/credits`)}>
          Credit history
        </Link>
      </div>
      <div className="flex mt-4 h-[68vh] justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Customer;
