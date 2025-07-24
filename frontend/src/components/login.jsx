import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const hasEffectRun = useRef(false);
  const navigate = useNavigate();
  const [custId, setCustId] = useState("");
  const [formData, setFormData] = useState({
    loginValue: "",
  });
  const [customerNames, setCustomerNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);

  // States for user feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Configure axios defaults for all requests
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    // Add debugging here
    console.log("Input value:", value);
    console.log("All customer names:", customerNames);

    // Filter customer names based on input value
    const filteredSuggestions = customerNames.filter(
      (name) => name && name.toLowerCase().includes(value.toLowerCase())
    );

    console.log("Filtered suggestions:", filteredSuggestions);
    setSuggestions(filteredSuggestions);

    // Clear any previous error messages when user types
    setErrorMessage("");
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (!hasEffectRun.current) {
      console.log("Effect runs only once");
      hasEffectRun.current = true;
      fetchCustomerNames();
    }
    // Add event listener to close suggestions on click outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch customer names every time component mounts
    fetchCustomerNames();
  }, []);

  const fetchCustomerNames = async () => {
    setIsLoading(true);
    const apiUrl = `${process.env.REACT_APP_API_URL}/fetch-customer`;

    try {
      const response = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Customer Data Response:", response.data);

      // Extract customer names from the response data
      // Assuming response.data is the array of customer objects
      if (Array.isArray(response.data)) {
        const names = response.data.map((customer) => customer.customer_name);
        setCustomerNames(names);
        console.log("Extracted customer names:", names);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage(
          "Authentication failed. Please log in again or contact support."
        );
      } else {
        setErrorMessage(
          "Failed to load customer names. Please refresh the page and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (value) => {
    setFormData((prevFormData) => ({ ...prevFormData, loginValue: value }));
    setSuggestions([]); // Hide suggestions after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate input
    if (!formData.loginValue.trim()) {
      setErrorMessage("Please enter a username");
      return;
    }

    // Show loading state
    setIsLoading(true);

    const apiUrl = `${process.env.REACT_APP_API_URL}/login`;

    try {
      const response = await axios.post(
        apiUrl,
        {
          loginValue: formData.loginValue,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      // Changed from response.data.Login to response.data.login (lowercase)
      if (response.data && response.data.login) {
        // Check if result array exists and has at least one item
        if (response.data.result && response.data.result.length > 0) {
          const { id, customer_name, phone_number, company_name, city } =
            response.data.result[0];

          // Store user data
          setCustId(id);
          localStorage.setItem("CUST_ID", id);
          localStorage.setItem("Name", customer_name);
          localStorage.setItem("company", company_name);
          localStorage.setItem("phone_number", phone_number);
          localStorage.setItem("city", city);

          // Show success message before redirect
          setSuccessMessage(
            `Login successful! Welcome, ${customer_name}. Redirecting...`
          );

          // Delay redirect so user sees success message
          setTimeout(() => {
            navigate("/cat-order");
          }, 1500);
        } else {
          setErrorMessage("User data incomplete. Please contact support.");
        }
      } else {
        setErrorMessage(
          "No such account found. Please check the username and try again."
        );
      }
    } catch (error) {
      // Error handling remains the same
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="card card-login">
            <h2>Customer Details</h2>
            <br></br>

            {/* Error message display */}
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            {/* Success message display */}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}

            <form className="billing-form" onSubmit={handleSubmit}>
              <div className="d-flex">
                <div className="col-md-12" style={{ paddingRight: 15 }}>
                  <label htmlFor="loginValue" className="form-label">
                    Username
                  </label>
                  {/* Input field with autocomplete feature */}
                  <input
                    type="text"
                    className={`form-control ${
                      errorMessage ? "is-invalid" : ""
                    }`}
                    id="loginValue"
                    placeholder="Enter username"
                    value={formData.loginValue}
                    onChange={handleInputChange}
                    name="loginValue"
                    disabled={isLoading}
                  />

                  {suggestions.length > 0 && (
                    <ul className="list-group" ref={dropdownRef}>
                      {suggestions.map((name, index) => (
                        <li
                          key={index}
                          className="list-group-item suggestion-item"
                          onClick={() => handleSelectSuggestion(name)}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn btn btn-lg mt-3 mb-3"
                style={{ backgroundColor: "navy", color: "white" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>

            {/* Info text */}
            <div className="mt-2 text-muted">
              <small>
                Enter your username to access your account. If you don't have an
                account or are experiencing issues, please contact support.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
