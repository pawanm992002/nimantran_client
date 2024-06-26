import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import "./styles/ClientDashboard.css";
import TransferCredit from "../components/client/TransferCredit";
import TableSwitch from "../components/client/TableSwitch";
import ClientInfoCard from "../components/client/ClientInfoCard";
import CreateNewCustomer from "../components/client/CreateNewCustomer";
import PurchaseCredit from "../components/client/PurchaseCredit";
const ClientDashboard = () => {
  const token = localStorage.getItem("token");
  const [clientInfo, setClientInfo] = useState({});
  const [customerId, setCustomerId] = useState("");
  const [creditModal, showCreditModal] = useState(false);
  const [createCustomerModal, showCreateCustomerModal] = useState(false);
  const [purchaseRequestModal, showPurchaseRequestModal] = useState(false);
  const fetchClientDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClientInfo(data?.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, []);

  const handleModalCredits = (Id) => {
    setCustomerId(Id);
    showCreditModal(!creditModal);
  };
  const handleModalCreateCustomer = () => {
    showCreateCustomerModal(!createCustomerModal);
  };
  const handleModalPurchaseRequest = () => {
    showPurchaseRequestModal(!purchaseRequestModal);
  };
  return (
    <>
      <Navbar />
      <div>
        <div className="client-dashboard">
          <div className="left-section-client">
            <ClientInfoCard clientInfo={clientInfo} />
            <div className="button-container">
              <button onClick={handleModalCreateCustomer}>
                Create New Customer
              </button>
              <button onClick={handleModalPurchaseRequest}>
                purchase Credits
              </button>
            </div>
          </div>
          <div>
            <TableSwitch
              clientInfo={clientInfo}
              handleModalCredits={handleModalCredits}
            />
            {creditModal && (
              <TransferCredit
                customerId={customerId}
                fetchClientDetails={fetchClientDetails}
                handleModalCredits={handleModalCredits}
              />
            )}
            {createCustomerModal && (
              <CreateNewCustomer
                fetchClientDetails={fetchClientDetails}
                handleModalCreateCustomer={handleModalCreateCustomer}
              />
            )}
            {purchaseRequestModal && (
              <PurchaseCredit
                handleModalPurchaseRequest={handleModalPurchaseRequest}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;
