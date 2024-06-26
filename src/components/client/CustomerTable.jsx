import React from 'react'
import "./styles/CustomerTable.css"
const CustomerTable = ({clientInfo ,handleModalCredits}) => {
  return (
    <>
          <h3 className='heading'>My Customers</h3>
      <div className="customer-info-container">
            <table className="customer-info-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Credits</th>
                  <th>Transfer Credit</th>
                </tr>
              </thead>
              <tbody>
                {clientInfo?.customers?.map((customer) => (
                  <tr key={customer._id}>
                    <td data-label="ID">{customer._id}</td>
                    <td data-label="Username">{customer.username}</td>
                    <td data-label="Credits">{customer.credits}</td>
                    <td>
                      <button
                        onClick={() => handleModalCredits(customer._id)}
                        className="btn-transfer-credit"
                      >
                        Transfer Credits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
  )
}

export default CustomerTable
