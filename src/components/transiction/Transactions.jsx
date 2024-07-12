import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Transactions = () => {
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const eventNameRef = useRef();
  const dateOfOrganisingRef = useRef();
  const locationRef = useRef();
  const csvFileRef = useRef();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/transictions/get-transictions/${customerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(response.data);
      } catch (err) {
        setError(
          err.response
            ? err.response.data.message
            : "Server error. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [customerId, token]);

  const handleCreateEvent = async () => {
    const formData = new FormData();
    formData.append("eventName", eventNameRef.current.value);
    formData.append("dateOfOrganising", dateOfOrganisingRef.current.value);
    formData.append("location", locationRef.current.value);
    if (csvFileRef.current.files[0]) {
      formData.append("guestNames", csvFileRef.current.files[0]);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/create-event/${customerId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setIsModalOpen(false);
    } catch (err) {
      console.error(
        err.response ? err.response.data.message : "Error creating event."
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Customer Transactions</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>
      </div>

      {transactions.length === 0 ? (
        <div>No transactions found for this customer.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 border-b sticky top-0 border">
              <tr>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b">
                  <td className="p-4">{transaction.type}</td>
                  <td className="p-4">{transaction.amount}</td>
                  <td className="p-4">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Create Event</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  ref={eventNameRef}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date of Organising</label>
                <input
                  type="date"
                  ref={dateOfOrganisingRef}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  ref={locationRef}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="guestCsv" className="block text-sm font-medium mb-1">Guest CSV File</label>
                <input
                  id="guestCsv"
                  type="file"
                  ref={csvFileRef}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateEvent}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
