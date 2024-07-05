import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";

const ClientDashboard = () => {
  const token = localStorage.getItem("token");
  const [clientInfo, setClientInfo] = useState({});

  const [createCustomerModal, showCreateCustomerModal] = useState(false);
  const [purchaseRequestModal, showPurchaseRequestModal] = useState(false);


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

  

  const handleModalCreateCustomer = () => {
    showCreateCustomerModal(!createCustomerModal);
  };

  const handleModalPurchaseRequest = () => {
    showPurchaseRequestModal(!purchaseRequestModal);
  };



 
  const [mobile, setmobile] = useState("");
  const [password, setPassword] = useState("");

  const createCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/create-customer`,
        { mobile, password },
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

  const [admincredits, setAdmincredits] = useState(0);

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
      if (data) {
        toast.success("Request Sent Successfully");
        fetchClientDetails();
      }
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };

  return (
    <>
     <div className="flex ">

    <div className="bg-white rounded-lg shadow-lg flex m-3  items-center p-6 lg:w-2/4 w-full">
      <div className="w-full mb-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="text-blue-500 text-xl font-semibold mb-2">Client ID:</h3>
          <p className="text-gray-800 text-lg">{clientInfo?._id}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="text-blue-500 text-xl font-semibold mb-2">Mobile:</h3>
          <p className="text-gray-800 text-lg">{clientInfo?.mobile}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="text-blue-500 text-xl font-semibold mb-2">Credits:</h3>
          <p className="text-gray-800 text-lg">{clientInfo?.credits}</p>
        </div>
      </div>
      
    </div>
    <div className="flex flex-col p-6 w-full">
    <button
        onClick={handleModalCreateCustomer}
        className="px-6 py-2 mb-4 w-full text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
        >
        Create New Customer
      </button>
      <button
        onClick={handleModalPurchaseRequest}
        className="px-6 py-2 w-full text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
        >
        Purchase Credits
      </button>
          </div>
        </div>
 


     

      {createCustomerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h3 className="text-2xl mb-4">Create New Customer</h3>
            <form onSubmit={createCustomer}>
              <div className="mb-4">
                <label className="block mb-2">Mobile:</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setmobile(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalCreateCustomer}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {purchaseRequestModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h3 className="text-2xl mb-4">Request Credits from Admin</h3>
            <form onSubmit={RequestCreditsFromAdmin}>
              <div className="mb-4">
                <label className="block mb-2">Credits:</label>
                <input
                  type="number"
                  value={admincredits}
                  onChange={(e) => setAdmincredits(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalPurchaseRequest}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientDashboard;

