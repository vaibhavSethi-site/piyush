import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const NutStock = () => {
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemPopupVisible, setAddItemPopupVisible] = useState(false);
  const [newItemRoller, setNewItemRoller] = useState("");
  const [newItemHandle, setNewItemHandle] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/nutHandle`
      );
      const data = response.data;
      console.log(data);
      setApiData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuantityChange = async (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].quantity = event.target.value;
    setApiData(updatedData);
    updateNut(updatedData[index]);
  };

  const handleHandleChange = async (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].handle = event.target.value;
    setApiData(updatedData);
    updateNut(updatedData[index]);
  };

  const handlePriceChange = async (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].price = event.target.value;
    setApiData(updatedData);
    updateNut(updatedData[index]);
  };

  const updateNut = async (nut) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/handle`, {
        id: nut.id,
        handle: nut.handle,
        quantity: nut.quantity,
        price: nut.price,
      });
      console.log("Nut updated successfully");
    } catch (error) {
      console.error("Error updating nut:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const toggleAddItemPopup = () => {
    setAddItemPopupVisible(!isAddItemPopupVisible);
  };

  const handleAddItem = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/handle`, {
        roller: newItemRoller,
        handle: newItemHandle,
        quantity: newItemQuantity,
        price: newItemPrice,
      });
      setNewItemRoller("");
      setNewItemHandle("");
      setNewItemQuantity("");
      setNewItemPrice("");
      setAddItemPopupVisible(false);
      fetchData(); // Fetch data after adding an item
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const filteredData = apiData.filter((item) => {
    return item.handle.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
                  <b>Handle</b>
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
                        value={item.handle}
                        onChange={(e) => handleHandleChange(index, e)}
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
                <h3>Add new stock of Handle</h3>
                <div className="popup-details">
                  <label htmlFor="newItemRoller">Roller:</label>
                  <input
                    type="text"
                    id="newItemRoller"
                    value={newItemRoller}
                    onChange={(e) => setNewItemRoller(e.target.value)}
                  />
                </div>

                <div className="popup-details">
                  <label htmlFor="newItemHandle">Handle:</label>
                  <input
                    type="text"
                    id="newItemHandle"
                    value={newItemHandle}
                    onChange={(e) => setNewItemHandle(e.target.value)}
                  />
                </div>

                <div className="popup-details">
                  <label htmlFor="newItemQuantity">Quantity:</label>
                  <input
                    type="number"
                    id="newItemQuantity"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                  />
                </div>

                <div className="popup-details">
                  <label htmlFor="newItemPrice">Price:</label>
                  <input
                    type="number"
                    id="newItemPrice"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                  />
                </div>

                <div className="popup-details">
                  <label htmlFor="imageUpload">Image:</label>
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

export default NutStock;
