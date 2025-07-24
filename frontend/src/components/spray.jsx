import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";

export default function CapOrder() {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/spray`);
        const data = response.data;
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on the search query whenever it changes
    const filtered = apiData.filter(item =>
      item.spray_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, apiData]);

  
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state when input changes
  };

  const handleOrder = (spray) => {
    const editArray = JSON.parse(localStorage.getItem("editArray"));
    const billingTableData = JSON.parse(
      localStorage.getItem("billingTableData")
    );

    if (editArray && editArray.random_id) {
      // If there's an editArray with a random_id, find and update the corresponding entry in billingTableData
      const editedItemIndex = billingTableData.findIndex(
        (item) => item.random_id === editArray.random_id
      );


      if (editedItemIndex !== -1) {
        // If the edited item is found, update the cap and other relevant properties
        console.log("Vani", billingTableData[editedItemIndex].spray_name, spray);

        billingTableData[editedItemIndex].spray_name = spray;
        const oldPrice = billingTableData[editedItemIndex].price || 0;
        localStorage.setItem(
          "Price",
          (parseFloat(localStorage.getItem("Price")) - oldPrice).toString()
        );
        const selectedSprayEntry = apiData.find(
          (item) => item.spray_name === spray
        );
  
        if (selectedSprayEntry) {
          let totalPrice = parseFloat(localStorage.getItem("Price")) || 0;
          totalPrice += parseFloat(selectedSprayEntry.price);
          localStorage.setItem("Price", totalPrice.toString());
          localStorage.setItem("spray", spray);
          navigate("/billing");
        } else {
          console.log("Selected spray not found in spray data.");
        }
        
        // Update other properties as needed
      }
      localStorage.setItem('billingTableData', JSON.stringify(billingTableData));

      
      navigate("/billing");
    } else {
      const selectedSprayEntry = apiData.find(
        (item) => item.spray_name === spray
      );

      if (selectedSprayEntry) {
        let totalPrice = parseFloat(localStorage.getItem("Price")) || 0;
        totalPrice += parseFloat(selectedSprayEntry.price);
        localStorage.setItem("Price", totalPrice.toString());
        localStorage.setItem("spray", spray);
        navigate("/billing");
      } else {
        console.log("Selected spray not found in spray data.");
      }
    }
  };

  return (
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
            <div
              className="card card-body size-card"
              key={item.id}
              onClick={() => handleOrder(item.spray_name)}
            >
              <div style={{ marginTop: 45, fontSize: 20 }}>
                <b>{item.spray_name}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
