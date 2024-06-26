import React from 'react';
import "./styles/ClientInfoCard.css";

const ClientInfoCard = ({ clientInfo }) => {
  return (
    <div className="client-card">
      <div className="client-info">
        <h3>{clientInfo?.role?.toUpperCase()} ID:</h3>
        <p>{clientInfo?._id?.toUpperCase()}</p>
      </div>
      <div className="client-info">
        <h3>{clientInfo?.role?.toUpperCase()} Username:</h3>
        <p>{clientInfo?.username}</p>
      </div>
      <div className="client-info">
        <h3>{clientInfo?.role?.toUpperCase()} Credits:</h3>
        <p>{clientInfo?.credits}</p>
      </div>
    </div>
  );
};

export default ClientInfoCard;
