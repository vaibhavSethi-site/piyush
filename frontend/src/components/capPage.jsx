import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const CapPage = ({ pipeSizes }) => {
  // Retrieve values from local storage
  const rollerSize = localStorage.getItem("selectedRollerSize");
  const pipeSize = localStorage.getItem("selectedPipeSize");
  const category = localStorage.getItem("selectedCategory");
  const rollerName = localStorage.getItem("selectedRoller");
  const[cap, setCap] = useState([])

  // Get the navigate function from react-router-dom
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/capStock`);

        if (!response.data || !Array.isArray(response.data)) {
          console.error('Invalid API response:', response.data);
          return;
        }

        // Logging the response data
        console.log(response.data);

        // Filter the response data based on rollerSize and pipeSize
        const selectedRollerSize = localStorage.getItem("selectedRollerSize");
        const selectedPipeSize = localStorage.getItem("selectedPipeSize");
        
        const filteredData = response.data.filter(item => 
          item.roller === selectedRollerSize && item.cap_size === selectedPipeSize 
        );
        console.log(filteredData);
          
        const capSet = new Set(filteredData.map(item => item.cap_name));
        const capArray = Array.from(capSet);

        // Update state with the filtered categories
        setCap(capArray);
        console.log(cap)

      } catch (error) {
        console.error('Error fetching rollerstock data:', error);
      }
    };

    fetchData();
  }, []); 

  

  // Log the retrieved values
  
  // Find the roller data
  
  // Function to handle button click and navigate to poly page
  const handleButtonClick = async (capName) => {
    try {
      const editArray = JSON.parse(localStorage.getItem('editArray'));
      let billingTableData = JSON.parse(localStorage.getItem('billingTableData')) || [];
  
      if (editArray && editArray.random_id) {
        const editedItemIndex = billingTableData.findIndex((item) => item.random_id === editArray.random_id);
        let currentAmount = parseInt(billingTableData[editedItemIndex].price) || 0;
  
        if (editedItemIndex !== -1) {
          billingTableData[editedItemIndex].cap = capName;
  
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/capStock`);
          const capStockData = response.data;
          console.log(capStockData)
  
          const selectedCapEntry = capStockData.find(item => item.cap_name === capName);
          console.log(currentAmount)
  
          currentAmount = currentAmount + selectedCapEntry.price;
          billingTableData[editedItemIndex].price = currentAmount;
  
       
          localStorage.setItem("selectedCap", cap);

          localStorage.setItem("Price", currentAmount);
          localStorage.setItem("billingTableData", JSON.stringify(billingTableData));
          localStorage.setItem("InvoiceData", localStorage.getItem("billingTableData"));

          navigate("/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly");
          return;
        }
      }
  
      else {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/capStock`);
        const capStockData = response.data;
        let currentAmount = parseInt(localStorage.getItem("Price")) || 0;
  
      const selectedCapEntry = capStockData.find(item => item.cap_name === capName);
  
      if (selectedCapEntry) {
        currentAmount += selectedCapEntry.price;
        localStorage.setItem("Price", currentAmount);
        localStorage.setItem("selectedCap", capName);
        navigate("/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly");
      } else {
        console.log("Selected cap not found in capStock data.");
      }
  
      }
    } catch (error) {
      console.error("Error fetching capStock data:", error);
    }
  };
  
  
  

  const skip = async () => {
    const editArray = JSON.parse(localStorage.getItem('editArray'));
    let billingTableData = JSON.parse(localStorage.getItem('billingTableData')) || [];
    

    if (editArray && editArray.random_id) {
      const editedItemIndex = billingTableData.findIndex((item) => item.random_id === editArray.random_id);
      let currentAmount = parseInt(billingTableData[editedItemIndex].price) || 0;

      if (editedItemIndex !== -1) {

        const previousCap = billingTableData[editedItemIndex].cap;
        if (previousCap) {
          // Fetch the cap's price
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/capStock?capName=${previousCap}`);
          const capPrice = response.data.price || 0;
          currentAmount = parseInt(billingTableData[editedItemIndex].price) - capPrice;
        }


        billingTableData[editedItemIndex].cap = "";

  
     
        localStorage.setItem("Price", currentAmount);

        localStorage.setItem("billingTableData", JSON.stringify(billingTableData));
        localStorage.setItem("InvoiceData", localStorage.getItem("billingTableData"));

        navigate("/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly");
      }
    }

    
    else {
      localStorage.setItem("selectedCap", "")
    navigate(
      "/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly"
    );
    }
  }

  return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="product-container">
            {cap.map((item) => (
              <div
                className="card card-body size-card"
                onClick={() => handleButtonClick(item)}
                key={item}
              >
                <div style={{ marginTop: 45, fontSize: 20 }}>
                  <b>{item}</b>
                </div>
              </div>
            ))}
        </div>
        <div className="skip-btn" style={{ textAlign: 'left' }} onClick={() => skip()}>
          <button type="button" style={{ backgroundColor: 'white', color: "navy", border: "none", paddingLeft: 30, paddingRight: 30, paddingTop:10, paddingBottom:10 }}><b>Skip</b></button>
        </div>
        </div>
      </div>
  );
};

export default CapPage;
