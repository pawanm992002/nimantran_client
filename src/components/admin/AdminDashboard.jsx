import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [acceptedRequestId, setAcceptedRequestId] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ADMIN}/getAllRequest`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(response.data.data.reverse());
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Error fetching requests");
    }
  };

  const createClient = async (e) => {
    e.preventDefault();
    try {
      if (!mobile || !password || !name) {
        toast.error("Enter all necessary fields");
        return;
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_ADMIN}/create-client`,
        { mobile, password, name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.flag) {
        toast.success(data.message);
        setIsModalOpen(false);
        setMobile("");
        setPassword("");
        setName("");
        fetchRequests(); // Fetch requests again after creating client
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleAcceptRequest = async (requestId) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/admin/acceptCreditRequest/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        fetchRequests(); // Refresh requests after accepting
      }
    } catch (error) {
      toast.error("Error accepting request");
    }
    setAcceptedRequestId("");
    setShowWarningModal(false);
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/admin/rejectCreditRequest/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        fetchRequests(); // Refresh requests after accepting
      }
    } catch (error) {
      toast.error("Error accepting request");
    }
  };
  const handleFiltersStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filteredData =
    selectedStatus === "All"
      ? requests
      : requests.filter((item) => item.status === selectedStatus.toLowerCase());
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap space-x-4">
          <button
            className={`px-6 py-2 text-lg font-semibold rounded-lg bg-blue-500 text-white`}
            onClick={() => setIsModalOpen(true)}
          >
            Create Client
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-30 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Client</h2>
            <form onSubmit={createClient}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-gray-700 mb-2">
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="temp_password"
                  className="block text-gray-700 mb-2"
                >
                  Temporary Password
                </label>
                <input
                  id="temp_password"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 font-semibold rounded-lg bg-gray-200 text-gray-800"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 font-semibold rounded-lg bg-blue-500 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showWarningModal && (
        <div className="fixed z-30 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Do you want to Accept Request ?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="px-6 py-2 font-semibold rounded-lg bg-gray-200 text-gray-800"
                onClick={() => {
                  setAcceptedRequestId("");
                  setShowWarningModal(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAcceptRequest(acceptedRequestId)}
                className="px-6 py-2 font-semibold rounded-lg bg-blue-500 text-white"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Requests Table */}
      <div className="overflow-auto mt-6 h-[53vh] border">
        <table className="min-w-full  bg-white border border-gray-200 border-collapse rounded-lg shadow-md">
          <thead className="sticky top-0">
            <tr>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                User Name
              </th>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                Date
              </th>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                Credits
              </th>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                <label>Status : </label>
                <select
                  className="border px-4 py-1  box-border rounded-md bg-gray-300"
                  onChange={(e) => handleFiltersStatusChange(e)}
                >
                  <option value="All">All</option>
                  <option value="Completed" className="text-green-500">
                    Completed
                  </option>
                  <option value="Pending" className="text-yellow-500">
                    Pending
                  </option>
                  <option value="Failed" className="text-red-500">
                    Failed
                  </option>
                </select>
              </th>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((request) => (
              <tr key={request._id}>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {request?.user?.name}
                </td>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {new Date(request.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {request.credits}
                </td>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {request.status}
                </td>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {request.status === "pending" && (
                    <div>
                      <button
                        className="px-4 py-1 bg-blue-500 text-white rounded-lg"
                        onClick={() => {
                          setShowWarningModal(true);
                          setAcceptedRequestId(request._id);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-1 bg-blue-500 text-white rounded-lg ml-2"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
