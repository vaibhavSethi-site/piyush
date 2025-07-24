import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

export default function CapOrder() {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/capstock`);
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on the search query whenever it changes
    const filtered = apiData.filter(item =>
      item.cap_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, apiData]);



  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state when input changes
  };


  const handleOrder = async (cap) => {
    try {
      const editArray = JSON.parse(localStorage.getItem('editArray'));
      const billingTableData = JSON.parse(localStorage.getItem('billingTableData'));
  
      if (editArray && editArray.random_id) {
        // If there's an editArray with a random_id, find and update the corresponding entry in billingTableData
        const editedItemIndex = billingTableData.findIndex(item => item.random_id === editArray.random_id);
  
        if (editedItemIndex !== -1) {
          // If the edited item is found, update the cap and other relevant properties
          billingTableData[editedItemIndex].cap = cap;
          const oldPrice = billingTableData[editedItemIndex].price || 0;
          localStorage.setItem("Price", (parseFloat(localStorage.getItem("Price")) - oldPrice).toString());
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/capstock`);
          const selectedCapEntry = response.data.find(item => item.cap_name === cap);
          if (selectedCapEntry) {
            // Add the new price to the total price
            localStorage.setItem("Price", (parseFloat(localStorage.getItem("Price")) + parseFloat(selectedCapEntry.price)).toString());
            // Update the price of the selected cap
            billingTableData[editedItemIndex].price = selectedCapEntry.price;
          } else {
            console.log("Selected cap not found in capstock data.");
          }
      
          

          // Update other properties as needed
        }
        localStorage.setItem('billingTableData', JSON.stringify(billingTableData));
        navigate("/billing")

      } else {
        // If no editArray or random_id is present, proceed with regular order handling
        const selectedCapEntry = apiData.find(item => item.cap_name === cap);
  
        if (selectedCapEntry) {
          let totalPrice = parseFloat(localStorage.getItem("Price")) || 0;
          totalPrice += parseFloat(selectedCapEntry.price);
          localStorage.setItem("Price", totalPrice.toString());
          localStorage.setItem("selectedCap", cap);
          navigate("/billing");
        } else {
          console.log("Selected cap not found in capstock data.");
        }
      }
    } catch (error) {
      console.error("Error handling order:", error);
    }
  };
  
  

  return (
    <div>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className='search' style={{ marginBottom: '10px', padding: '5px' }}>
          <input
            type="text"
            className='search-input'
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
          <div className="product-container">

         
            {filteredData.map((item) => (
              <div className='card card-body size-card' key={item.id} onClick={() => handleOrder(item.cap_name)}>
                <div style={{marginTop:45, fontSize:20}} onClick={() => handleOrder(item.cap_name)}><b>{item.cap_name}</b></div>
              </div>
            ))}


          </div>
        </div>
      </div>
    </div>
  );
}
