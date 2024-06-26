import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-hot-toast";
import "./styles/TransferCredit.css";

const TransferCredit = ({fetchClientDetails, customerId ,handleModalCredits }) => {
  const [credits, setCredits] = useState(0);

  const transferCredits = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/transfer-credits`,
        { customerId, credits: parseInt(credits) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Credits transferred");
      fetchClientDetails();
      handleModalCredits(customerId);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className='Transfer-credit-container'>
      <form onSubmit={transferCredits}>
         <h1 className='close-btn' onClick={()=>handleModalCredits(customerId)}>❌</h1>
        <h2>Transfer Credit to Customer</h2>
        <div>
          <label htmlFor="credits">Credits to Transfer</label>
          <input
            type="number"
            placeholder="Credits"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
        </div>
        <button type="submit">Transfer Credits</button>
      </form>
    </div>
  );
}

export default TransferCredit;
