import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CapStock = () => {
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemPopupVisible, setAddItemPopupVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newCapName, setNewCapName] = useState("");
  const [newCapSize, setNewCapSize] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/capstock`);
        const data = response.data;
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
    updateCap(updatedData[index]);
  };

  const handlePriceChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].price = event.target.value;
    setApiData(updatedData); // Update apiData state with the new price
    updateCap(updatedData[index]);
  };

  const handleCapChange = (index, event) => { 
    const updatedData = [...apiData];
    updatedData[index].cap_name = event.target.value;
    setApiData(updatedData); // Update apiData state with the new price
    updateCap(updatedData[index]);
  };

  const updateCap = async (cap) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/cap`, {
        id: cap.id,
        cap_name: cap.cap_name,
        quantity: cap.quantity,
        price: cap.price
      });
      console.log("Cap updated successfully");
    } catch (error) {
      console.error("Error updating cap:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const filteredData = apiData.filter((item) =>
    item.cap_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAddItemPopup = () => {
    setAddItemPopupVisible(!isAddItemPopupVisible);
  };

  const handleAddItem = async () => {
    try {
      const newItemData = {
        roller: newItemName,
        cap_size: newCapSize,
        cap_name: newCapName,
        quantity: newItemQuantity,
        price: newItemPrice
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/capstock`, newItemData);
      console.log("New item added successfully");
      setNewItemName("");
      setNewCapSize("");
      setNewCapName("");
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
        <div style={{marginLeft:400}}>
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
                  <b>Cap</b>
                </td>
                <td>
                  <b>Cap Size</b>
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
                        
                        value={item.cap_name}
                        onChange={(e) => handleCapChange(index, e)}
                      /></td>
                    <td>{item.cap_size}</td>
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
                <h3>Add new stock of Cap</h3>
                <div className="popup-details">
                  <label htmlFor="newItemName" style={{paddingRight:10}}>Roller:</label>
                  <input
                    type="text"
                    id="newItemName"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>
                <div className="popup-details">
                  <label htmlFor="newCapName" style={{paddingRight:10}}>Cap Name:</label>
                  <input
                    type="text"
                    id="newCapName"
                    value={newCapName}
                    onChange={(e) => setNewCapName(e.target.value)}
                  />
                </div>
                <div className="popup-details">
                  <label htmlFor="newCapSize" style={{paddingRight:10}}>Cap Size:</label>
                  <input
                    type="text"
                    id="newCapSize"
                    value={newCapSize}
                    onChange={(e) => setNewCapSize(e.target.value)}
                  />
                </div>
                <div className="popup-details">
                  <label htmlFor="newItemQuantity" style={{paddingRight:10}}>Quantity:</label>
                  <input
                    type="number"
                    id="newItemQuantity"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                  />
                </div>
                <div className="popup-details">
                  <label htmlFor="newItemPrice" style={{paddingRight:10}}>Price:</label>
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
                <button className="mt-3" style={{backgroundColor: "navy", color:"white"}} onClick={handleAddItem}>Add Item</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapStock;
