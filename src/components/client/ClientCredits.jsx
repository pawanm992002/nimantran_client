import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableSwitch, setTableSwitch] = useState("transfer");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/transictions/get-client-transaction?areaOfUse=${tableSwitch}`,
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
  }, [token, tableSwitch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full mx-auto ">
      <h2 className="text-2xl font-bold mb-8">Customer Transactions</h2>
      <div className="flex justify-between mb-6">
        <div className="flex flex-wrap space-x-4">
          <button
            className={`px-6 py-2 text-lg font-semibold rounded-lg ${
              tableSwitch === "transfer"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setTableSwitch("transfer")}
          >
            Transactions
          </button>
          <button
            className={`px-6 py-2 text-lg font-semibold rounded-lg ${
              tableSwitch === "spend"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setTableSwitch("spend")}
          >
            Credit Spend in Editing
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 w-1/3  min-w-40 max-h-10 border border-gray-300 rounded-lg"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner"></div> {/* Spinner */}
        </div>
      ) : (
        <div>
          {transactions.length === 0 ? (
            <div>No Transactions yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    {transactions.length > 0 && !transactions[0].eventId ? <th className="text-left p-4">Reciever</th> : <th className="text-left p-4">Event</th>} 
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((transaction) => (
                    <tr key={transaction._id} className="border-b">
                      <td className="p-4">{transaction.recieverId.name}</td>
                      <td className="p-4">{transaction.amount}</td>
                      <td className="p-4">
                        {new Date(
                          transaction.transactionDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-4">{transaction.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;
