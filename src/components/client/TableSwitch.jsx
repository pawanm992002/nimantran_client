import React, { useState } from "react";
import CustomerTable from "./CustomerTable";
import CustomerRequestTable from "./CustomerRequestTable";
import "./styles/TableSwitch.css";

const TableSwitch = ({ clientInfo, handleModalCredits }) => {
  const [tableSwitch, setTableSwitch] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("username");

  const handleTab = (isCustomerTab) => {
    setTableSwitch(isCustomerTab);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortKey(event.target.value);
  };

  // Ensure clientInfo and clientInfo.customers are defined
  const filteredCustomers = (clientInfo?.customers || [])
    .filter((customer) =>
      customer.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortKey === "status") {
        const statusOrder = { pending: 1, accepted: 2, rejected: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      } else {
        return 0;
      }
    });

  return (
    <div className="customer-table-section">
      <div className="tab-section">
        <div
          className={`tab ${tableSwitch ? "active" : ""}`}
          onClick={() => handleTab(true)}
        >
          My Customer
        </div>
        <div
          className={`tab ${!tableSwitch ? "active" : ""}`}
          onClick={() => handleTab(false)}
        >
          Customer Request
        </div>
      </div>
      {tableSwitch ? (
        <>
          <div className="controls">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
          </div>
          <CustomerTable
            clientInfo={{ ...clientInfo, customers: filteredCustomers }}
            handleModalCredits={handleModalCredits}
          />
        </>
      ) : (
        <>
          <div className="controls">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
            <select onChange={handleSortChange} className="sort-dropdown">
              <option value="date">Sort by Request Date</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          <CustomerRequestTable
            clientInfo={{ ...clientInfo, customers: filteredCustomers }}
          />
        </>
      )}
    </div>
  );
};

export default TableSwitch;
