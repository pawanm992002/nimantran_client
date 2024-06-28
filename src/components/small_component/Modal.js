import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ show, handleClose, children, modalHeading }) => {
  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className='modal-heading'> {modalHeading} </h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
