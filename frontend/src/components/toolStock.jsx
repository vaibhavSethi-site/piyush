import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ToolStock = () => {
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemPopupVisible, setAddItemPopupVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tools`);
        const data = response.data;
        console.log(data);
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].quantity = event.target.value;
    setApiData(updatedData);
    updateTool(updatedData[index]);
  };

  const handleToolChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].tool_name = event.target.value;
    setApiData(updatedData);
    updateTool(updatedData[index]);
  };

  const handlePriceChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].price = event.target.value;
    setApiData(updatedData);
    updateTool(updatedData[index]);
  };

  const updateTool = async (tool) => {
    try {
      // Send updated tool data to the server
      await axios.put(`${process.env.REACT_APP_API_URL}/tools`, {
        id: tool.id,
        tool_name: tool.tool_name,
        quantity: tool.quantity,
        price: tool.price,
      });

      // Log success message
      console.log(`Updated tool ${tool.tool_name}`);
    } catch (error) {
      console.error("Error updating tool:", error);
    }
  };

  const handleImageChange = (event) => {
    // Assuming you want to handle the selected image here
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const filteredData = searchQuery
    ? apiData.filter((item) =>
        item.tool_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : apiData;

  const toggleAddItemPopup = () => {
    setAddItemPopupVisible(!isAddItemPopupVisible);
  };

  const handleAddItem = async () => {
    try {
      // Send new item data to the server
      await axios.post(`${process.env.REACT_APP_API_URL}/tools`, {
        tool_name: newItemName,
        quantity: newItemQuantity,
        price: newItemPrice,
      });

      // Log success message
      console.log("New item added successfully");

      // Reset input fields and hide the popup
      setNewItemName("");
      setNewItemQuantity("");
      setNewItemPrice("");
      setAddItemPopupVisible(false);
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ marginLeft: 500 }}>
          <div className="input-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="icon-plus1" onClick={toggleAddItemPopup}>
            <FontAwesomeIcon icon={faCirclePlus} />
            Add more items
          </div>
          <table className="table-cap striped-table">
            <thead>
              <tr style={{ backgroundColor: "#001f3f", color: "white" }}>
                <td>
                  <b>S.No</b>
                </td>
                <td>
                  <b>Tools</b>
                </td>
                <td>
                  <b>Quantity</b>
                </td>
                <td>
                  <b>Price</b>
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredData &&
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 !== 0 ? "even-row" : "odd-row"}
                  >
                    <td>{index + 1}</td>
                    <td>                      <input
                        
                        value={item.tool_name}
                        onChange={(e) => handleToolChange(index, e)}
                      /></td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePriceChange(index, e)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {isAddItemPopupVisible && (
            <div className="overlay">
              <div className="add-item-popup">
                <div className="cross">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="cancel-icon"
                    onClick={toggleAddItemPopup}
                  />
                </div>
                <h3>Add new stock of Tool</h3>
                <div className="popup-details">
                  <label htmlFor="newItemName" style={{ paddingRight: 10 }}>
                    Name:
                  </label>
                  <input
                    type="text"
                    id="newItemName"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>

                <div className="popup-details">
                  <label htmlFor="newItemQuantity" style={{ paddingRight: 10 }}>
                    Quantity:
                  </label>
                  <input
                    type="number"
                    id="newItemQuantity"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                  />
                </div>

                <div className="popup-details">
                  <label htmlFor="newItemPrice" style={{ paddingRight: 10 }}>
                    Price:
                  </label>
                  <input
                    type="number"
                    id="newItemPrice"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                  />
                </div>

                <div className="popup-details">
                  <label htmlFor="imageUpload" style={{ paddingRight: 10 }}>
                    Image:
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    onChange={handleImageChange}
                  />
                </div>

                <button
                  className="mt-3"
                  style={{ backgroundColor: "navy", color: "white" }}
                  onClick={handleAddItem}
                >
                  Add Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolStock;
