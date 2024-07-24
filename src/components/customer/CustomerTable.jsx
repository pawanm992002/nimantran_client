import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const CustomerTable = () => {
  const token = localStorage.getItem("token");
  const [clientInfo, setClientInfo] = useState({});
  const [customerId, setCustomerId] = useState("");
  const [creditModal, showCreditModal] = useState(false);
  const [credits, setCredits] = useState(0);
  const [tableSwitch, setTableSwitch] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  const fetchClientDetails = async () => {
    setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, []);

  const handleTab = (isCustomerTab) => {
    setTableSwitch(isCustomerTab);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = (clientInfo?.customers || []).filter((customer) =>
    customer?.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = (clientInfo?.receiveRequests || []).filter(
    (request) =>
      request?.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request?._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const transferCredits = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/transfer-credits`,
        { customerId, credits: parseInt(credits) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Credits transferred");
      fetchClientDetails();
      handleModalCredits(customerId);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleModalCredits = (Id) => {
    setCustomerId(Id);
    showCreditModal(!creditModal);
  };

  const navigate = useNavigate();
  const handleCustomerProfile = (id) => {
    navigate(`/customer`,{state:id});
  };

  return (
    <div>
      <div className="rounded-lg p-6 flex-3 max-w-full h-[70vh]">
        <div className="flex justify-between mb-6">
          <div className="flex flex-wrap space-x-4">
            <button
              className={`px-6 py-2 text-lg font-semibold rounded-lg ${
                tableSwitch
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTab(true)}
            >
              My Users
            </button>
            <button
              className={`px-6 py-2 text-lg font-semibold rounded-lg ${
                !tableSwitch
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTab(false)}
            >
              User Requests
            </button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 w-1/3 min-w-40 max-h-10 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="overflow-auto max-h-full font-light">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="spinner"></div> {/* Spinner */}
            </div>
          ) : tableSwitch ? (
            <table className="w-full table-auto max-h-full border-collapse relative">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">Credits</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="even:bg-gray-100 odd:bg-white cursor-pointer hover:bg-slate-200"
                  >
                    <td
                      onClick={() => handleCustomerProfile(customer._id)}
                      className="px-4 py-2 text-center"
                    >
                      {customer.name}
                    </td>
                    <td className="px-4 py-2 text-center">{customer.mobile}</td>
                    <td className="px-4 py-2 text-center">
                      {customer.credits}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleModalCredits(customer._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      >
                        Transfer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full table-auto h-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Credits</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="even:bg-gray-100 odd:bg-white"
                  >
                    <td className="px-4 py-2">{request._id}</td>
                    <td className="px-4 py-2">{request.mobile}</td>
                    <td className="px-4 py-2">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{request.credits}</td>
                    <td
                      className={`px-4 py-2 ${
                        request.status === "pending"
                          ? "text-yellow-600"
                          : request.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {request.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {creditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h3 className="text-2xl mb-4">Transfer Credits</h3>
            <form onSubmit={transferCredits}>
              <div className="mb-4">
                <label className="block mb-2">Credits:</label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  min={1}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalCredits}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
