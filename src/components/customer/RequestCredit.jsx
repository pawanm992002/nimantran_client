import React, { useState } from 'react';
import axios from 'axios';
import './styles/RequestCredit.css'; // Assuming you save the CSS in this file

const RequestCredit = () => {
  const [credits, setCredits] = useState(0);

  const requestCredit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/users/purchase-request-from-client', { credits }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Credits purchased');
    } catch (error) {
      console.error(error);
      alert('Error buying credits');
    }
  };

  return (
    <div className="request-credit">
      <h3>Buy Credits</h3>
      <input
        type="number"
        placeholder="Credits"
        value={credits}
        onChange={(e) => setCredits(e.target.value)}
      />
      <button onClick={requestCredit}>Buy Credits</button>
    </div>
  );
};

export default RequestCredit;
