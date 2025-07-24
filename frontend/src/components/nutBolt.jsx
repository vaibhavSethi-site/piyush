import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';
import Navbar from './navbar';

const BoltsPage = ({ pipeSizes }) => {
  const [roller, setRoller] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [nut, setNut] = useState([]);

  const navigate = useNavigate();
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/nutHandle`);

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid API response:', response.data);
        return;
      }

      const selectedRollerSize = localStorage.getItem("selectedRollerSize");
      const filteredData = response.data.filter(item => item.roller === selectedRollerSize);
      
      // If you want to set the first item's roller and quantity
      if (filteredData.length > 0) {
        setRoller(filteredData[0].roller);
        setQuantity(filteredData[0].quantity);
      }

      const handleSet = new Set(filteredData.map(item => item.handle));
      const handleArray = Array.from(handleSet);

      setNut(handleArray);
    } catch (error) {
      console.error('Error fetching nut handle data:', error);
    }
  };

  fetchData();
}, []);

const skip = async () => {
  try {
    const editArray = JSON.parse(localStorage.getItem("editArray"));
    let billingTableData = JSON.parse(localStorage.getItem("billingTableData")) || [];

    if (editArray?.random_id) {
      const editedItemIndex = billingTableData.findIndex((item) => item.random_id === editArray.random_id);
      
      if (editedItemIndex !== -1) {
        let currentAmount = parseInt(billingTableData[editedItemIndex].price) || 0;

        const previousBoltName = billingTableData[editedItemIndex].nutHandle;
        if (previousBoltName) {
          // Fetch the handle's price
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/nutHandle?handle=${previousBoltName}`);
          const handlePrice = response.data[0]?.price || 0; // Assuming response.data is an array
          currentAmount -= handlePrice;
        }

        billingTableData[editedItemIndex].nutHandle = "";
        billingTableData[editedItemIndex].price = currentAmount;

        localStorage.setItem("Price", currentAmount);
        localStorage.setItem("billingTableData", JSON.stringify(billingTableData));
        localStorage.setItem("InvoiceData", JSON.stringify(billingTableData));
        navigate('/billing');
        return;
      }
    }

    // If no editArray or item not found, just clear nutBolt and navigate
    localStorage.setItem("nutBolt", "");
    navigate('/billing');
  } catch (error) {
    console.error('Error in skip function:', error);
    // Handle error appropriately
  }
};

const handleAddBolt = async (handle) => {
  try {
    const editArray = JSON.parse(localStorage.getItem('editArray'));
    let billingTableData = JSON.parse(localStorage.getItem('billingTableData')) || [];

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/nutHandle?handle=${handle}`);
    const handleData = response.data[0]; // Assuming the response is an array
    
    if (!handleData) {
      console.error("Selected handle not found in nutHandle data.");
      return;
    }
    
    let currentAmount = parseInt(localStorage.getItem("Price")) || 0;
    currentAmount += handleData.price;

    localStorage.setItem("Price", currentAmount);
    localStorage.setItem("nutBolt", handle);

    if (editArray?.random_id) {
      const editedItemIndex = billingTableData.findIndex(item => item.random_id === editArray.random_id);

      if (editedItemIndex !== -1) {
        // Subtract previous handle price if exists
        const previousHandle = billingTableData[editedItemIndex].nutHandle;
        if (previousHandle) {
          const prevResponse = await axios.get(`${process.env.REACT_APP_API_URL}/nutHandle?handle=${previousHandle}`);
          const prevHandlePrice = prevResponse.data[0]?.price || 0;
          currentAmount -= prevHandlePrice;
        }

        billingTableData[editedItemIndex].nutHandle = handle;
        billingTableData[editedItemIndex].price = currentAmount;

        localStorage.setItem("Price", currentAmount);
        localStorage.setItem("billingTableData", JSON.stringify(billingTableData));
        localStorage.setItem("InvoiceData", JSON.stringify(billingTableData));
        navigate("/billing");
        return;
      }
    }

    await axios.post(`${process.env.REACT_APP_API_URL}/handle`, {
      roller,
      handle,
      quantity,
      price: handleData.price
    });

    // Reset state
    setRoller('');
    setQuantity('');
    setPrice('');

    navigate('/billing');

  } catch (error) {
    console.error('Error adding bolt:', error);
    // Handle error (show message to user, etc.)
  }
};

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="product-container">
          {nut.map((item) => (
            <div className='card card-body size-card' key={item} onClick={() => handleAddBolt(item)}>
              <div style={{ marginTop: 45, fontSize: 20 }}><b>{item}</b></div>
            </div>
          ))}
        </div>
        <div className="skip-btn" style={{ textAlign: 'left' }}>
          <button type="button" style={{ backgroundColor: 'white', color: "navy", border: "none", paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 }} onClick={() => skip()}><b>Skip</b></button>
        </div>
      </div>
    </div>
  );
};

export default BoltsPage;
