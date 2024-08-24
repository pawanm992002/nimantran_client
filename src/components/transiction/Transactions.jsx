import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Transactions = () => {
  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const customerId = params.get("customerId");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableSwitch, setTableSwitch] = useState("transfer");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/transictions/get-transictions?areaOfUse=${tableSwitch}&customerId=${customerId}`,
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

  useEffect(() => {
    fetchTransactions();
  }, [token, tableSwitch]);

  const filteredTransactions = transactions.filter((transaction) => {
    return transaction?.recieverId?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });
  const filteredCreditSpendingTransactions = transactions.filter(
    (transaction) => {
      return transaction?.eventId?.eventName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
  );

  if (loading)
    return (
      <div className="flex h-full w-full justify-center items-center">
        <div className="spinner"></div> {/* Spinner */}
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full flex flex-col overflow-hidden no-scrollbar h-full mx-auto">
      <h2 className="text-2xl p-3 font-bold mb-3">Customer Transactions</h2>
      <div className="flex justify-between p-2 mb-6">
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
          className="px-4 py-2 w-1/3 min-w-40 max-h-10 border border-gray-300 rounded-lg"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner"></div> {/* Spinner */}
        </div>
      ) : (
        <div>
          {transactions.length === 0 ? (
            <div>No Transactions yet </div>
          ) : tableSwitch === "transfer" ? (
            <div className="overflow-x-auto h-[55vh]">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    {transactions?.length > 0 && !transactions[0]?.eventId ? (
                      <th className="text-left p-4">Receiver</th>
                    ) : (
                      <th className="text-left p-4">Event</th>
                    )}
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction?._id} className="hover:bg-gray-100">
                      <td className="p-4">{transaction?.recieverId?.name}</td>
                      <td className="p-4">{transaction?.amount}</td>
                      <td className="p-4">
                        {new Date(
                          transaction?.transactionDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-4">{transaction?.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto h-[55vh]">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    {transactions?.length > 0 && tableSwitch === "spend" ? (
                      <th className="text-left p-4">Event</th>
                    ) : (
                      <th className="text-left p-4">Receiver</th>
                    )}
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                    {tableSwitch === "spend" && (
                      <th className="text-left p-4">Media Edit</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredCreditSpendingTransactions.reverse()?.map((transaction) => (
                    <tr key={transaction?._id} className="hover:bg-gray-100">
                      <td className="p-4">{transaction?.eventId?.eventName}</td>
                      <td className="p-4">{transaction?.amount}</td>
                      <td className="p-4">
                        {new Date(
                          transaction?.transactionDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-4">{transaction?.status}</td>
                      {tableSwitch === "spend" && (
                        <td className="p-4">{transaction?.areaOfUse}</td>
                      )}
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








// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSearchParams } from "react-router-dom";

// const Transactions = () => {
//   const token = localStorage.getItem("token");
//   const [params] = useSearchParams();
//   const customerId = params.get("customerId");

//   const [transactions, setTransactions] = useState([]);
//   const [creditSpendings, setCreditSpendings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showTransactions, setShowTransactions] = useState(true);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/transictions/get-transictions/${customerId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setTransactions(response.data);
//       } catch (err) {
//         setError(
//           err.response
//             ? err.response.data.message
//             : "Server error. Please try again later."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchCreditSpendings = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/credits/get-credits/${customerId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setCreditSpendings(response.data);
//       } catch (err) {
//         setError(
//           err.response
//             ? err.response.data.message
//             : "Server error. Please try again later."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//     fetchCreditSpendings();
//   }, [customerId, token]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl font-bold">Customer Transactions</h2>
//         <div>
//           <button
//             className={`mr-4 ${showTransactions ? "font-bold" : ""}`}
//             onClick={() => setShowTransactions(true)}
//           >
//             Transactions
//           </button>
//           <button
//             className={`${!showTransactions ? "font-bold" : ""}`}
//             onClick={() => setShowTransactions(false)}
//           >
//             Credit Spendings
//           </button>
//         </div>
//       </div>

//       {showTransactions ? (
//         transactions.length === 0 ? (
//           <div>No transactions found for this customer.</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border">
//               <thead className="bg-gray-100 border-b sticky top-0 border">
//                 <tr>
//                   <th className="text-left p-4">Type</th>
//                   <th className="text-left p-4">Amount</th>
//                   <th className="text-left p-4">Date</th>
//                   <th className="text-left p-4">Status</th>
//                   <th className="text-left p-4">Sender</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map((transaction) => (
//                   <tr key={transaction._id} className="border-b">
//                     <td className="p-4">{transaction.areaOfUse}</td>
//                     <td className="p-4">{transaction.amount}</td>
//                     <td className="p-4">
//                       {new Date(transaction.transactionDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-4">{transaction.status}</td>
//                     <td className="p-4">{transaction.senderId.name}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )
//       ) : creditSpendings.length === 0 ? (
//         <div>No credit spendings found for this customer.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border">
//             <thead className="bg-gray-100 border-b sticky top-0 border">
//               <tr>
//                 <th className="text-left p-4">Type</th>
//                 <th className="text-left p-4">Amount</th>
//                 <th className="text-left p-4">Date</th>
//                 <th className="text-left p-4">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {creditSpendings.map((creditSpending) => (
//                 <tr key={creditSpending._id} className="border-b">
//                   <td className="p-4">{creditSpending.areaOfUse}</td>
//                   <td className="p-4">{creditSpending.amount}</td>
//                   <td className="p-4">
//                     {new Date(creditSpending.transactionDate).toLocaleDateString()}
//                   </td>
//                   <td className="p-4">{creditSpending.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Transactions;
