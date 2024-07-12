import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'client'
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
      console.log(response);
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
      setLoading(false);
    }
  };
  const handleCustomerProfile = (id) => {
    localStorage.setItem("customerId", id);
    navigate(`/customer/profile`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => user.role === activeTab);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-auto p-4">
      <div className="flex flex-wrap space-x-4 mb-4">
        <button
          className={`px-6 py-2 text-lg font-semibold rounded-lg ${activeTab === 'customer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('customer')}
        >
          Customers
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold rounded-lg ${activeTab === 'client' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('client')}
        >
          Clients
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">Name</th>
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">Mobile</th>
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">Email</th>
            {activeTab === 'customer' && (
              <>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">Date of Birth</th>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">Location</th>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">Gender</th>
              </>
            )}
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">Role</th>
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">Credits</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} onClick={()=>handleCustomerProfile(user._id)} className='cursor-pointer'>
              <td className="py-2 px-4 border-b text-center border-gray-200">{user.name}</td>
              <td className="py-2 px-4 border-b text-center border-gray-200">{user.mobile}</td>
              <td className="py-2 px-4 border-b text-center border-gray-200">{user.email}</td>
              {activeTab === 'customer' && (
                <>
                  <td className="py-2 px-4 border-b text-center border-gray-200">
                    {new Date(user.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center border-gray-200">{user.location}</td>
                  <td className="py-2 px-4 border-b text-center border-gray-200">{user.gender}</td>
                </>
              )}
              <td className="py-2 px-4 border-b text-center border-gray-200">{user.role}</td>
              <td className="py-2 px-4 border-b text-center border-gray-200">{user.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
