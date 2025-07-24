import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    city: "",
    pincode: "",
    state: "",
    companyName: "",
  });
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("billingTableData")) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const resumeOrder = () => {
    navigate("/billing");
    setShowPopup(false);
  };

  const newOrder = () => {
    localStorage.clear();
    setShowPopup(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = `${process.env.REACT_APP_API_URL}/createcustomer`;

    if (!formData.name || !formData.phoneNumber) {
      console.error("Name and Phone Number are required.");
      return;
    }

    try {
      const response = await axios.post(apiUrl, {
        customer_name: formData.name,
        phone_number: formData.phoneNumber,
        city: formData.city,
        pincode: formData.pincode,
        company_name: formData.companyName,
      });

      console.log("API Response:", response.data);

      if (response.data === "No such account found") {
        console.log("No such account found");
        // Handle this case as needed, e.g., show an error message to the user
      } else {
        // Only navigate when the response is not "No such account found"
        navigate("/login");
      }
    } catch (error) {
      console.error("API Error:", error);
      // Handle error response if needed
    }
  };

  const loginPage = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div
            className="dark-overlay"
            style={{ display: showPopup ? "block" : "none" }}
          ></div>
          {showPopup && (
            <div className="popup1">
              <button className="close-icon" onClick={closePopup}>
                <IoMdClose />{" "}
              </button>
              <div className="popup-header">
                <h2>Resume or New Order?</h2>
              </div>
              <div className="popup-content">
                <button className="btn btn-success" onClick={resumeOrder}>
                  Resume
                </button>
                <button
                  className="btn btn-danger"
                  onClick={newOrder}
                  style={{ marginLeft: 20 }}
                >
                  New Order
                </button>
              </div>
            </div>
          )}
          <div className="card card-customer">
            <h2>Customer Details!</h2>
            <form className="billing-form" onSubmit={handleSubmit}>
              {/* Your form content goes here */}
              <div className="d-flex">
                <div className="col-md-4" style={{ paddingRight: 15 }}>
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter the name of Client"
                    value={formData.name}
                    onChange={handleInputChange}
                    name="name"
                  />
                </div>
                <div className="col-md-4" style={{ paddingRight: 15 }}>
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone No.
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    name="phoneNumber"
                  />
                </div>
                <div className="col-md-4" style={{ paddingRight: 15 }}>
                  <label htmlFor="companyName" className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    placeholder="Enter the name of Company"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    name="companyName"
                  />
                </div>
              </div>
              <div className="d-flex mt-2">
                <div className="col-md-4" style={{ paddingRight: 15 }}>
                  <label htmlFor="pincode" className="form-label">
                    Pincode(Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pincode"
                    placeholder="Enter the pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    name="pincode"
                  />
                </div>
                <div className="col-md-4" style={{ paddingRight: 15 }}>
                  <label htmlFor="city" className="form-label">
                    City(Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleInputChange}
                    name="city"
                  />
                </div>
              </div>
              <div className="mt-2" style={{ color: "navy" }}>
                <a style={{ color: "navy" }} onClick={loginPage}>
                  Already a customer?
                </a>
              </div>

              <button
                type="submit"
                className="submit-btn btn btn-lg mt-3 mb-3"
                style={{ backgroundColor: "navy", color: "white" }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
