import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const customerId = localStorage.getItem("customerId");

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full mx-auto ">
      <h2 className="text-2xl font-bold mb-8">Customer Transactions</h2>
      {transactions.length === 0 ? (
        <div>No transactions found for this customer.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 border-b">
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
    </div>
  );
};

export default Transactions;
