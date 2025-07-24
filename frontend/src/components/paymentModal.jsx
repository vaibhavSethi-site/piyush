// AddPaymentModal.js
import React, { useState } from 'react';

const AddPaymentModal = ({ onClose }) => {
  const [paymentDate, setPaymentDate] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  const handleDateChange = (e) => {
    setPaymentDate(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmountPaid(e.target.value);
  };

  const handleSubmit = () => {
    // Add your logic to handle the submitted data
    // For example, you can update the transactions state in the parent component
    onClose(); // Close the modal after handling the submission
  };

  return (
    <div className="modal-overlay m-5">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add Recent Payment</h2>
        <div style={{marginTop:10, marginBottom:10}}>
          <label htmlFor="paymentDate">Payment Date:</label>
          <input
            type="date"
            id="paymentDate"
            value={paymentDate}
            onChange={handleDateChange} style={{marginLeft:10}}
          />
        </div>
        <div style={{marginTop:10, marginBottom:10}}>
          <label htmlFor="amountPaid">Amount Paid:</label>
          <input
            type="number"
            id="amountPaid"
            value={amountPaid}
            onChange={handleAmountChange} style={{marginLeft:10}}
          />
        </div>
        <button className='btn' style={{backgroundColor:'navy', color:'white', marginTop:10, marginBottom:10}} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default AddPaymentModal;
