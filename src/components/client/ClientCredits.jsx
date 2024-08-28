import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Transactions = () => {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [transactionsSpend, setTransactionsSpend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByDate, setSortByDate] = useState(false); // State for date sorting

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortToggle = () => {
    setSortByDate(!sortByDate); // Toggle the sorting order
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const [transferResponse, spendResponse] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/transictions/get-client-transaction?areaOfUse=transfer`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/transictions/get-client-transaction?areaOfUse=spend`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      setTransactions(transferResponse.data);
      setTransactionsSpend(spendResponse.data);
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

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  // Combine and standardize transactions
  const combinedTransactions = [
    ...transactions.map((transaction) => ({
      statement: `Received by ${transaction?.recieverId?.name}`,
      amount: transaction?.amount,
      date: new Date(transaction?.transactionDate),
      status: transaction?.status,
      type: "Transfer",
    })),
    ...transactionsSpend.map((transaction) => ({
      statement: `Spent on ${
        transaction?.eventId?.eventName !== undefined
          ? transaction?.eventId?.eventName
          : "no event name"
      } [${transaction?.areaOfUse}]`,
      amount: transaction?.amount,
      date: new Date(transaction?.transactionDate),
      status: transaction?.status,
      type: "Credit Spending",
    })),
  ];

  // Sort transactions by date
  const sortedTransactions = combinedTransactions.sort((a, b) => {
    if (sortByDate) {
      return new Date(a.date) - new Date(b.date); // Ascending order
    } else {
      return new Date(b.date) - new Date(a.date); // Descending order
    }
  });

  const filteredTransactions = sortedTransactions.filter((transaction) =>
    transaction.statement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <div className="spinner"></div> {/* Spinner */}
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full flex flex-col no-scrollbar h-full mx-auto">
      <div className="w-full flex items-center justify-between px-3 py-2">
        <h2 className="text-2xl font-bold mb-3">Customer Transactions</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 w-1/3 min-w-40 max-h-10 border border-gray-300 rounded-lg"
        />
      </div>

      {filteredTransactions.length === 0 ? (
        <div>No Transactions yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="text-left p-4">Statement</th>
                <th className="text-left p-4">Credit</th>
                <th className="text-left p-4">
                  Date{" "}
                  <button className="mx-1" onClick={handleSortToggle}>
                    <FontAwesomeIcon
                      icon={faArrowRightArrowLeft}
                      className={`rotate-90 text-sm ${
                        sortByDate ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                </th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-4">{transaction.statement}</td>
                  <td className="p-4 text-red-500">{transaction.amount}</td>
                  <td className="p-4">
                    {transaction.date.toLocaleDateString()}
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
