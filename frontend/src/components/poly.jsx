import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const PolyPage = ({ pipeSizes }) => {
  // Retrieve values from local storage
  const rollerSize = localStorage.getItem("selectedRollerSize");
  const pipeSize = localStorage.getItem("selectedPipeSize");
  const category = localStorage.getItem("selectedCategory");
  const rollerName = localStorage.getItem("selectedRoller");
  const capName = localStorage.getItem("selectedCap");
  const [poly, setPoly] = useState([]);

  // Get the navigate function from react-router-dom
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/polyStock`
        );

        if (!response.data || !Array.isArray(response.data)) {
          console.error("Invalid API response:", response.data);
          return;
        }

        // Logging the response data
        console.log(response.data);

        // Filter the response data based on rollerSize and pipeSize
        const selectedRollerSize = localStorage.getItem("selectedRollerSize");

        const filteredData = response.data.filter(
          (item) => item.roller === selectedRollerSize
        );
        console.log(filteredData);

        const polySet = new Set(filteredData.map((item) => item.poly));
        const polyArray = Array.from(polySet);

        // Update state with the filtered categories
        setPoly(polyArray);
        console.log(poly);
      } catch (error) {
        console.error("Error fetching poly stock data:", error);
      }
    };

    fetchData();
  }, []);

  const skip = async () => {

    const editArray = JSON.parse(localStorage.getItem("editArray"));
      let billingTableData =
        JSON.parse(localStorage.getItem("billingTableData")) || [];


    if (editArray && editArray.random_id) {
      const editedItemIndex = billingTableData.findIndex((item) => item.random_id === editArray.random_id);
      let currentAmount = parseInt(billingTableData[editedItemIndex].price) || 0;

      if (editedItemIndex !== -1) {

        const previousPoly = billingTableData[editedItemIndex].poly;
        if (previousPoly) {
          // Fetch the cap's price
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/polyStock?poly=${previousPoly}`);
          const polyPrice = response.data.price || 0;
          currentAmount = parseInt(billingTableData[editedItemIndex].price) - polyPrice;
        }


        billingTableData[editedItemIndex].poly = "";

  
     
        localStorage.setItem("Price", currentAmount);

        localStorage.setItem("billingTableData", JSON.stringify(billingTableData));
        localStorage.setItem("InvoiceData", localStorage.getItem("billingTableData"));

        navigate("/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly/bolt");
      }
    }
    else {
      localStorage.setItem("selectedPoly", "");
      navigate(
        "/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly/bolt"
      );
  
}

  };

  // Function to handle button click and navigate to bolt page
  const handleButtonClick = async (polyName) => {
    try {
      const editArray = JSON.parse(localStorage.getItem("editArray"));
      let billingTableData =
        JSON.parse(localStorage.getItem("billingTableData")) || [];

      if (editArray && editArray.random_id) {
        let billingTableData =
          JSON.parse(localStorage.getItem("billingTableData")) || [];
        const editedItemIndex = billingTableData.findIndex(
          (item) => item.random_id === editArray.random_id
        );

        if (editedItemIndex !== -1) {
          // Retrieve the previously selected poly name
          const previousPolyName = billingTableData[editedItemIndex].poly;
          billingTableData[editedItemIndex].poly = polyName;
          let currentAmount = parseInt(billingTableData[editedItemIndex].price) || 0;
          // Fetch the polyStock data from the API
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/polyStock`
          );
          const polyStockData = response.data;
          // Find the entry matching the previously selected poly name
          
          const selectedPolyEntry = polyStockData.find(item => item.poly === polyName);
          console.log(currentAmount);

          currentAmount = currentAmount  + selectedPolyEntry.price;
          billingTableData[editedItemIndex].price = currentAmount;
        
            console.log(currentAmount,selectedPolyEntry.price );
         
          localStorage.setItem("Price", currentAmount);
            localStorage.setItem("selectedPoly", polyName);
            localStorage.setItem('billingTableData', JSON.stringify(billingTableData));
        }
        navigate(
          "/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly/bolt"
        );
      }

      // Fetch the polyStock data from the API
      else {
        // Fetch the polyStock data from the API
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/polyStock`
        );
        const polyStockData = response.data;

        // Find the entry matching the selected poly name
        const selectedPolyEntry = polyStockData.find(
          (item) => item.poly === polyName
        );

        if (selectedPolyEntry) {
          // Log the price of the selected poly
          console.log("Price of", polyName, ":", selectedPolyEntry.price);

          // Update the price in localStorage
          let currentAmount = parseInt(localStorage.getItem("Price")) || 0;
          const newAmount = currentAmount + selectedPolyEntry.price;
          localStorage.setItem("Price", newAmount);

          // Store the selected poly name in local storage
          localStorage.setItem("selectedPoly", polyName);

          // Navigate to the bolt page
          navigate(
            "/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly/bolt"
          );
        } else {
          console.log("Selected poly not found in polyStock data.");
        }
      }
    } catch (error) {
      console.error("Error fetching polyStock data:", error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="product-container">
          {poly.map((item) => (
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
        <div className="skip-btn" style={{ textAlign: "left" }}>
          <button
            type="button"
            style={{
              backgroundColor: "white",
              color: "navy",
              border: "none",
              paddingLeft: 30,
              paddingRight: 30,
              paddingTop: 10,
              paddingBottom: 10,
            }}
            onClick={() => skip()}
          >
            <b>Skip</b>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolyPage;
