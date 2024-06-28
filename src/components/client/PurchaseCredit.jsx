import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./styles/PurchaseCredit.css";

const PurchaseCredit = ({ fetchClientDetails, handleModalPurchaseRequest}) => {
  const [admincredits, setAdmincredits] = useState(0);

  const RequestCreditsFromAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/purchase-request-from-admin`,
        { credits: parseInt(admincredits) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data) {
        toast.success("Request Sent Successfully");
        fetchClientDetails();
      }
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
      <h1 className='close-btn' onClick={()=>handleModalPurchaseRequest()}>❌</h1>
        <form onSubmit={RequestCreditsFromAdmin}>
          <h2>Purchase Credit From Admin</h2>
          <div className="form-group">
            <label htmlFor="credits">Enter Credit for Request</label>
            <input
              id="credits"
              type="number"
              placeholder="Credits"
              value={admincredits}
              onChange={(e) => setAdmincredits(e.target.value)}
              required
            />
          </div>
          <button type="submit" onClick={handleModalPurchaseRequest} className="btn-submit">Request Credits From Admin</button>
        </form>
      </div>
    </div>
  );
};

export default PurchaseCredit;
