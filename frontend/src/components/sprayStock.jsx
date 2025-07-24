import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SprayStock = () => {
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemPopupVisible, setAddItemPopupVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/spray`);
      const data = response.data;
      console.log(data);
      setApiData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleQuantityChange = async (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].quantity = event.target.value;
    setApiData(updatedData);
    updateSprayQuantity(updatedData[index]);
  };

  const handleSprayChange = async (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].spray_name = event.target.value;
    setApiData(updatedData);
    updateSprayQuantity(updatedData[index]);
  };

  const handlePriceChange = async (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].price = event.target.value;
    setApiData(updatedData);
    updateSprayPrice(updatedData[index]);
  };

  const updateSprayQuantity = async (spray) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/spray`, {
        id: spray.id,
        spray_name: spray.spray_name,
        quantity: spray.quantity,
        price: spray.price,
      });
      console.log("Spray quantity updated successfully");
    } catch (error) {
      console.error("Error updating spray quantity:", error);
    }
  };

  const updateSprayPrice = async (spray) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/spray`, {
        id: spray.id,
        price: spray.price,
      });
      console.log("Spray price updated successfully");
    } catch (error) {
      console.error("Error updating spray price:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const filteredData = searchQuery
    ? apiData.filter((item) =>
        item.spray_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : apiData;

  const toggleAddItemPopup = () => {
    setAddItemPopupVisible(!isAddItemPopupVisible);
  };

  const handleAddItem = async () => {
    try {
      // Send new item data to the server
      await axios.post(`${process.env.REACT_APP_API_URL}/spray`, {
        spray_name: newItemName,
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

      // Fetch updated data
      fetchData();
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ marginLeft: 400 }}>
          <div className="input-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <table className="table-cap striped-table">
            <thead>
              <tr style={{ backgroundColor: "#001f3f", color: "white" }}>
                <td>
                  <b>S.No</b>
                </td>
                <td>
                  <b>Spray Name</b>
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
                    <td>
                      {" "}
                      <input
                        value={item.spray_name}
                        onChange={(e) => handleSprayChange(index, e)}
                      />
                    </td>
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

          <div className="icon-plus1" onClick={toggleAddItemPopup}>
            <FontAwesomeIcon icon={faCirclePlus} />
            Add more items
          </div>

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
                <h3>Add new stock of Spray</h3>
                <div className="popup-details">
                  <label htmlFor="newItemName" style={{ paddingRight: 10 }}>
                    Spray Name:
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

export default SprayStock;
