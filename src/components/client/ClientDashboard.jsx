import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

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

  const nameRef = useRef("");
  const mobileRef = useRef("");
  const passwordRef = useRef("");
  const emailRef = useRef("");
  const genderRef = useRef("");
  const dateOfBirthRef = useRef("");
  const locationRef = useRef("");

  const createCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const newCustomer = {
        name: nameRef.current.value,
        mobile: mobileRef.current.value,
        password: passwordRef.current.value,
        email: emailRef.current.value,
        gender: genderRef.current.value,
        dateOfBirth: dateOfBirthRef.current.value,
        location: locationRef.current.value,
      };
      console.log(newCustomer);

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/create-customer`,
        newCustomer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data) {
        toast.success("New Customer Added Successfully");
        fetchClientDetails();
        handleModalCreateCustomer(); // Close the modal after creation
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="flex m-8">
        <div className="bg-white rounded-lg shadow-lg flex items-center p-6 lg:w-2/4 w-full">
          <div className="w-full m-5">
            <div className="bg-blue-50 p-5 rounded-lg mb-4">
              <h3 className="text-blue-500 text-xl font-semibold mb-2">
                Client ID:
              </h3>
              <p className="text-gray-800 text-lg">{clientInfo?._id}</p>
            </div>
            <div className="bg-blue-50 p-5 rounded-lg mb-4">
              <h3 className="text-blue-500 text-xl font-semibold mb-2">
                Mobile:
              </h3>
              <p className="text-gray-800 text-lg">{clientInfo?.mobile}</p>
            </div>
            <div className="bg-blue-50 p-5 rounded-lg mb-4">
              <h3 className="text-blue-500 text-xl font-semibold mb-2">
                Credits:
              </h3>
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
          <div className="bg-white rounded-lg p-8 w-2/3 max-h-full overflow-y-auto">
            <h3 className="text-2xl mb-4">Create New Customer</h3>
            <form onSubmit={createCustomer}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block mb-2">Name:</label>
                  <input
                    type="text"
                    ref={nameRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Mobile:</label>
                  <input
                    type="text"
                    ref={mobileRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Password:</label>
                  <input
                    type="password"
                    ref={passwordRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Email:</label>
                  <input
                    type="email"
                    ref={emailRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Gender:</label>
                  <select
                    ref={genderRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Date of Birth:</label>
                  <input
                    type="date"
                    ref={dateOfBirthRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block mb-2">Location:</label>
                  <input
                    type="text"
                    ref={locationRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
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
