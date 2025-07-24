import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const PolyStock = () => {
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemPopupVisible, setAddItemPopupVisible] = useState(false);
  const [newItemRoller, setNewItemRoller] = useState("");
  const [newItemPoly, setNewItemPoly] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/poly_stock`);
      const data = response.data;
      setApiData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuantityChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].quantity = event.target.value;
    setApiData(updatedData);
    updatePoly(updatedData[index]);
  };

  const handlePriceChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].price = event.target.value;
    setApiData(updatedData);
    updatePoly(updatedData[index]);
  };

  const handlePolyChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].poly = event.target.value;
    setApiData(updatedData);
    updatePoly(updatedData[index]);
  };

  const updatePoly = async (poly) => {
    try {
        await axios.put(`${process.env.REACT_APP_API_URL}/poly`, {
          id: poly.id,
          poly: poly.poly,
        quantity: poly.quantity,
        price: poly.price
      });
      console.log("Poly updated successfully");
    } catch (error) {
      console.error("Error updating poly:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const toggleAddItemPopup = () => {
    setAddItemPopupVisible(!isAddItemPopupVisible);
  };

  const filteredData = apiData.filter((item) => {
    return (
      item.poly.toLowerCase().includes(searchQuery.toLowerCase()) 
      
    );
  });

  const handleAddItem = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/poly`, {
        roller: newItemRoller,
        poly: newItemPoly,
        quantity: newItemQuantity,
        price: newItemPrice
      });
      console.log("Response:", response.data);
      fetchData();
    } catch (error) {
      console.error("Error adding item:", error);
    }
    setNewItemRoller("");
    setNewItemPoly("");
    setNewItemQuantity("");
    setNewItemPrice("");
    setAddItemPopupVisible(false);
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

          <table className="table-cap striped-table">
            <thead>
              <tr style={{ backgroundColor: "#001f3f", color: "white" }}>
                <td>
                  <b>S.No</b>
                </td>
                <td>
                  <b>Poly</b>
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
                        
                        value={item.poly}
                        onChange={(e) => handlePolyChange(index, e)}
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
                <h3>Add new stock of Poly</h3>
                <div className="popup-details">
                  <label htmlFor="newItemRoller" style={{paddingRight:10}}>Roller:</label>
                  <input
                    type="text"
                    id="newItemRoller"
                    value={newItemRoller}
                    onChange={(e) => setNewItemRoller(e.target.value)}
                  />
                </div>
                <div className="popup-details">
                  <label htmlFor="newItemPoly" style={{paddingRight:10}}>Poly:</label>
                  <input
                    type="text"
                    id="newItemPoly"
                    value={newItemPoly}
                    onChange={(e) => setNewItemPoly(e.target.value)}
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

export default PolyStock;
