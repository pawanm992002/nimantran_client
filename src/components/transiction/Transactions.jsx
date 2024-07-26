import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Transactions = () => {
  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const customerId = params.get("customerId");

  const [transactions, setTransactions] = useState([]);
  const [creditSpendings, setCreditSpendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTransactions, setShowTransactions] = useState(true);

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

    const fetchCreditSpendings = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/credits/get-credits/${customerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCreditSpendings(response.data);
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
    fetchCreditSpendings();
  }, [customerId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Customer Transactions</h2>
        <div>
          <button
            className={`mr-4 ${showTransactions ? "font-bold" : ""}`}
            onClick={() => setShowTransactions(true)}
          >
            Transactions
          </button>
          <button
            className={`${!showTransactions ? "font-bold" : ""}`}
            onClick={() => setShowTransactions(false)}
          >
            Credit Spendings
          </button>
        </div>
      </div>

      {showTransactions ? (
        transactions.length === 0 ? (
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
                  <th className="text-left p-4">Sender</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b">
                    <td className="p-4">{transaction.areaOfUse}</td>
                    <td className="p-4">{transaction.amount}</td>
                    <td className="p-4">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{transaction.status}</td>
                    <td className="p-4">{transaction.senderId.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : creditSpendings.length === 0 ? (
        <div>No credit spendings found for this customer.</div>
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
              {creditSpendings.map((creditSpending) => (
                <tr key={creditSpending._id} className="border-b">
                  <td className="p-4">{creditSpending.areaOfUse}</td>
                  <td className="p-4">{creditSpending.amount}</td>
                  <td className="p-4">
                    {new Date(creditSpending.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">{creditSpending.status}</td>
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
