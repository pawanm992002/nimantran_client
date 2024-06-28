import React from 'react';
import './styles/CustomerTable.css';

const CustomerRequestTable = ({ clientInfo }) => {
  console.log(clientInfo?.receiveRequests);
  return (
    <>
        <h3 className='heading'>Customers Requests</h3>
      <div className="customer-info-container">
        <table className="customer-info-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Request Date</th>
              <th>Credits</th>
              <th>Status</th>
              <th>Accept Request</th>
              <th>Reject Request</th>
            </tr>
          </thead>
          <tbody>
            {clientInfo?.receiveRequests?.map((customer) => (
              <tr key={customer._id}>
                <td data-label="Username">{customer.userId}</td>
                <td data-label="Request Date">{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td data-label="Credits">{customer.credits}</td>
                <td data-label="Status">{customer.status}</td>
                <td>
                  <button className="btn-transfer-credit accept-btn">
                    Accept
                  </button>
                </td>
                <td>
                  <button className="btn-transfer-credit reject-btn">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerRequestTable;
