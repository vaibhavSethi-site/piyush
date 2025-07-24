import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const RollerStock = () => {

  
  const isAdmin = localStorage.getItem("role") === "admin";


  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemPopupVisible, setAddItemPopupVisible] = useState(false);
  const [newRollerData, setNewRollerData] = useState({
    roller_size: "",
    pipe_size: "",
    cat: "",
    roller_name: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/rollerstock`
        );
        setApiData(response.data);
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
    updateRoller(updatedData[index]);
  };

  const handleSizeChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].roller_size = event.target.value;
    setApiData(updatedData);
    updateRoller(updatedData[index]);
  };

  const handlePipeChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].pipe_size = event.target.value;
    setApiData(updatedData);
    updateRoller(updatedData[index]);
  };

  const handleCatChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].cat = event.target.value;
    setApiData(updatedData);
    updateRoller(updatedData[index]);
  };

  const handleRollerChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].roller_name = event.target.value;
    setApiData(updatedData);
    updateRoller(updatedData[index]);
  };

  const handlePriceChange = (index, event) => {
    const updatedData = [...apiData];
    updatedData[index].Price = event.target.value;
    setApiData(updatedData); // Update apiData state with the new price
    updateRoller(updatedData[index]);
  };

  const updateRoller = async (roller) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/roller`, {
        id: roller.id,
        roller_size: roller.roller_size,
        pipe_size: roller.pipe_size,
        cat: roller.cat,
        roller_name: roller.roller_name,
        quantity: roller.quantity,
        price: roller.Price,
      });
      console.log("Roller updated successfully");
    } catch (error) {
      console.error("Error updating roller:", error);
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/rollerstock`,
        newRollerData
      );
      console.log("Item added successfully");
    } catch (error) {
      console.error("Error adding item:", error);
    }
    setAddItemPopupVisible(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRollerData({ ...newRollerData, [name]: value });
  };

  const toggleAddItemPopup = () => {
    setAddItemPopupVisible(!isAddItemPopupVisible);
  };

  const filteredData = apiData.filter((item) => {
    return (
      item.roller_size.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pipe_size.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roller_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


  const handleDeleteItem = async (item) => {
    let deleteConfirm = window.confirm(`Delete "${item.roller_name}" ?`);

    if (deleteConfirm){
        const deleteRes = await axios.delete(
        `${process.env.REACT_APP_API_URL}/rollerstock/${item.id}`,
        {}
      );

      if(deleteRes){
        alert("Deleted !")
      }else{
        alert("Failed ❌");
      }

    }

      }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ marginLeft: 150 }}>
          <div className="input-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

{
                        isAdmin ? <div className="icon-plus1" onClick={toggleAddItemPopup}><FontAwesomeIcon icon={faCirclePlus} />Add more items</div> : ''
                      }

          

          <table className="table-cap striped-table">
            <thead>
              <tr style={{ backgroundColor: "#001f3f", color: "white" }}>
                <td>
                  <b>S.No</b>
                </td>
                <td>
                  <b>Roller size</b>
                </td>
                <td>
                  <b>Pipe size</b>
                </td>
                <td>
                  <b>Category</b>
                </td>
                <td>
                  <b>Roller Name</b>
                </td>
                <td>
                  <b>Quantity</b>
                </td>
                <td style={{ width: 100 }}>
                  <b>Price</b>
                </td>

                  {
                        isAdmin ? <td style={{ width: 100 }}><b>Delete</b></td> : ''
                      }
                
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
                        value={item.roller_size}
                        onChange={(e) => handleSizeChange(index, e)}
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        value={item.pipe_size}
                        onChange={(e) => handlePipeChange(index, e)}
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        value={item.cat}
                        onChange={(e) => handleCatChange(index, e)}
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        value={item.roller_name}
                        onChange={(e) => handleRollerChange(index, e)}
                      />
                    </td>{" "}
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e)}
                      />
                    </td>
                    <td style={{ width: 100 }}>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePriceChange(index, e)}
                      />
                    </td>

                  {
                        isAdmin ? <td style={{ 'min-width': '200px' }}><button className="deleteBtn" onClick={() => handleDeleteItem(item)}>Delete Item</button></td> : ''
                      }
                    
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
                <h3>Add new stock of Rollers</h3>
                <form onSubmit={handleAddItem}>
                  <div className="popup-details">
                    <label htmlFor="roller_size">Roller Size:</label>
                    <input
                      type="text"
                      id="roller_size"
                      name="roller_size"
                      value={newRollerData.roller_size}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="popup-details">
                    <label htmlFor="pipe_size">Pipe Size:</label>
                    <input
                      type="text"
                      id="pipe_size"
                      name="pipe_size"
                      value={newRollerData.pipe_size}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="popup-details">
                    <label htmlFor="cat">Category:</label>
                    <input
                      type="text"
                      id="cat"
                      name="cat"
                      value={newRollerData.cat}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="popup-details">
                    <label htmlFor="roller_name">Roller Name:</label>
                    <input
                      type="text"
                      id="roller_name"
                      name="roller_name"
                      value={newRollerData.roller_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="popup-details">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={newRollerData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="popup-details">
                    <label htmlFor="price">Price:</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={newRollerData.Price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    className="mt-3"
                    style={{ backgroundColor: "navy", color: "white" }}
                    type="submit"
                  >
                    Add Item
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RollerStock;
