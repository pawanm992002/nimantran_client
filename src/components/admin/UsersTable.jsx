import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("customer"); // 'customer' or 'client'
  const [creditModal, setCreditModal] = useState(false);
  const [creditsToTransfer, setCreditsToTransfer] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/admin/getAllUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching users");
      setLoading(false);
    }
  };

  const handleCustomerProfile = (id) => {
    if (activeTab === "customer") {
      localStorage.setItem("customerId", id);
      navigate(`/customer/profile?customerId=${id}`);
    }
  };

  const transferCreditsToClient = async (e, customerId) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/transfer-credits-to-client`,
        { userId: selectedCustomerId, credits: parseInt(creditsToTransfer) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCreditsToTransfer(0);
      setSelectedCustomerId("");
      setCreditModal(false);
      fetchUsers();
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => user.role === activeTab);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-auto p-4">
      <div className="flex flex-wrap space-x-4 mb-4">
        <button
          className={`px-6 py-2 text-lg font-semibold rounded-lg ${
            activeTab === "customer"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("customer")}
        >
          Customers
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold rounded-lg ${
            activeTab === "client"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("client")}
        >
          Clients
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
              Name
            </th>
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
              Mobile
            </th>
            {activeTab === "customer" && (
              <>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                  Date of Birth
                </th>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                  Location
                </th>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                  Gender
                </th>
              </>
            )}
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
              Credits
            </th>
            {activeTab === "client" && (
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user._id}
              onClick={() => handleCustomerProfile(user._id)}
              className="cursor-pointer"
            >
              <td className="py-2 px-4 border-b text-center border-gray-200">
                {user.name}
              </td>
              <td className="py-2 px-4 border-b text-center border-gray-200">
                {user.mobile}
              </td>
              {activeTab === "customer" && (
                <>
                  <td className="py-2 px-4 border-b text-center border-gray-200">
                    {new Date(user.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center border-gray-200">
                    {user.location}
                  </td>
                  <td className="py-2 px-4 border-b text-center border-gray-200">
                    {user.gender}
                  </td>
                </>
              )}
              <td className="py-2 px-4 border-b text-center border-gray-200">
                {user.credits}
              </td>
              {activeTab === "client" && (
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  <button
                    className="px-6 py-2 text-lg font-semibold rounded-lg bg-blue-500 text-white"
                    onClick={() => {
                      setCreditModal(true);
                      setSelectedCustomerId(user._id);
                    }}
                  >
                    Transfer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {creditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Transfer Credits</h2>
            <form
              onSubmit={(e) => transferCreditsToClient(e, selectedCustomerId)}
            >
              <div className="mb-4">
                <label
                  htmlFor="credits"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credits
                </label>
                <input
                  type="number"
                  id="credits"
                  value={creditsToTransfer}
                  onChange={(e) => setCreditsToTransfer(e.target.value)}
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setCreditModal(false);
                    setSelectedCustomerId("");
                    setCreditsToTransfer(0);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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

export default UsersTable;
