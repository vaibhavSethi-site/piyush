import React, { useState, useEffect, useRef } from "react";
import "./RecordOfTransactions.css";
import Sidebar from "./sidebar";
import axios from "axios"; // Import axios library
import { Link } from "react-router-dom";

const RecordOfTransactions = () => {

  const isAdmin = localStorage.getItem("role") === "admin";


  const hasEffectRun = useRef(false);

  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [id, setId] = useState(null);
  const [cashAmountInput, setCashAmountInput] = useState("");
  const [chequeAmountInput, setChequeAmountInput] = useState("");
  const [showCashPopup, setShowCashPopup] = useState(false);
  const [showChequePopup, setShowChequePopup] = useState(false);
  const [customerNames, setCustomerNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Your existing useEffect logic...
  }, [setTableData]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`);
        
        if (response.data && response.data.orders) {
          setTransactions(response.data.orders);
          setTableData(response.data.orders);
          setTotalAmount(calculateTotalAmount(response.data.orders));
          
          // If there's data, set the first customer as default
          if (response.data.orders.length > 0) {
            const firstCustomer = response.data.orders[0].customer_name;
            setSearchQuery(firstCustomer);
            localStorage.setItem("cust_name", firstCustomer);
            localStorage.setItem("cust_id", response.data.orders[0].cust_id);
          }
        }
      } catch (error) {
        console.error("Error fetching all orders:", error);
      } 
    };

    fetchAllOrders();
    fetchCustomerNames();
  }, []);

  useEffect(() => {
    // Load data if there's a customer name in localStorage
    const savedCustomerName = localStorage.getItem("cust_name");
    if (savedCustomerName) {
      setSearchQuery(savedCustomerName);
      handleSearch();
    }
  }, []);

  const fetchCustomerNames = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/fetch-customer`;

    try {
      const response = await axios.get(apiUrl);
      const names = response.data.map((customer) => customer.customer_name);
      setCustomerNames(names);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleCashSubmit = async () => {
    try {
      // Make sure selectedTransaction exists
      if (!selectedTransaction) return;
      if(!isAdmin){
        alert("No access")
        return;
      }

      // Prepare the data to send to the API
      const requestData = {
        orderId: selectedTransaction.order_id,
        cash_amount: cashAmountInput, // Use the amount entered by the user
        orderDetails: selectedTransaction,
      };

      // Call the API to update the cash amount
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/updateOrderCashAmount`,
        requestData
      );

      // Handle the response as needed, e.g., show a success message
      console.log("Cash amount updated successfully:", response.data);

      // Close the popup
      handleClosePopup("cash");

      handleSearch();
    } catch (error) {
      console.error("Error updating cash amount:", error);
    }
  };

  const handleChequeSubmit = async () => {
    try {
      // Make sure selectedTransaction exists
      if (!selectedTransaction) return;
      if(!isAdmin){
        alert("No access");
        return;
      }

      // Prepare the data to send to the API
      const requestData = {
        orderId: selectedTransaction.order_id,
        cheque_amount: chequeAmountInput, // Use the amount entered by the user
        orderDetails: selectedTransaction,
      };

      // Call the API to update the cheque amount
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/updateOrderChequeAmount`,
        requestData
      );

      // Handle the response as needed, e.g., show a success message
      console.log("Cheque amount updated successfully:", response.data);

      // Close the popup
      handleClosePopup("cheque");
      handleSearch();
    } catch (error) {
      console.error("Error updating cheque amount:", error);
    }
  };

   const handleSearch = async () => {
    try {
      const custName = searchQuery.trim();
      
      // If search query is empty, fetch all orders
      if (!custName) {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`);
        if (response.data && response.data.orders) {
          setTableData(response.data.orders);
          setTotalAmount(calculateTotalAmount(response.data.orders));
        }
        return;
      }

      // Search for specific customer
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        { customer_name: custName }
      );

      if (response.data && response.data.orders) {
        setTransactions(response.data.orders);
        setTableData(response.data.orders);
        setTotalAmount(calculateTotalAmount(response.data.orders));

        if (response.data.customer_name) {
          localStorage.setItem("cust_name", response.data.customer_name);
        }

        if (response.data.cust_id) {
          localStorage.setItem("cust_id", response.data.cust_id);
          const accountsResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/accounts_customer`,
            { cust_id: response.data.cust_id }
          );
          setAmount(accountsResponse.data.total_balance);
        }
      }
    } catch (error) {
      console.error("Error in search:", error);
    } 
  };
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value); // Update the searchQuery state with the input value
    const filteredSuggestions = customerNames.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = async (name) => {
    setSearchQuery(name);
    localStorage.setItem("cust_name", name);
    setSuggestions([]);

    try {
      // Get customer ID when selecting a name
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/customer`,
        {
          customer_name: name,
        }
      );

      if (response.data && response.data.cust_id) {
        localStorage.setItem("cust_id", response.data.cust_id);
      }
    } catch (error) {
      console.error("Error fetching customer ID:", error);
    }
  };

  const calculateTotalAmount = (orders) => {
    return orders.reduce((total, order) => total + order.amount_to_pay, 0);
  };

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleClosePopup = (popupType) => {
    if (popupType === "cash") {
      setShowCashPopup(false);
    } else if (popupType === "cheque") {
      setShowChequePopup(false);
    }
    setSelectedTransaction(null);
  };

  const uniqueOrderIds = Array.from(
    new Set(tableData.map((transaction) => transaction.order_id))
  );

  const handleRowClick1 = (transaction) => {
    console.log("Clicked Transaction:", transaction);
    const ordersWithSameId = tableData.filter(
      (item) => item.order_id === transaction.order_id
    );
    console.log("Orders with Same ID:", ordersWithSameId);
    const totalAmount = ordersWithSameId.reduce(
      (total, order) => total + order.amount_to_pay,
      0
    );
    const cashAmount =
      ordersWithSameId.length > 0 ? ordersWithSameId[0].cash_amount : 0;
    localStorage.setItem("cashAmount", cashAmount);

    localStorage.setItem("amountTotal", totalAmount);
    localStorage.setItem("ledgersOrder", JSON.stringify(ordersWithSameId));
  };

  return (
    <div>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="record-container">
            <div className="heading-container d-flex">
              <h2>Record of Transactions</h2>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <button onClick={handleSearch}>Search</button>
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((name, index) => (
                      <li
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSelectSuggestion(name)}
                        style={{ color: "black" }}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {tableData.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Customer Name</th>
                      <th>Description</th>
                      <th>Transaction Amount</th>
                      <th>Action</th>
                      {
                        isAdmin ? <th>Edit</th> : ''
                      }
                      
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueOrderIds.map((orderId, index) => {
                      const transactionsWithOrderId = tableData.filter(
                        (transaction) => transaction.order_id === orderId
                      );
                      return (
                        <React.Fragment key={index}>
                          {transactionsWithOrderId.map(
                            (transaction, innerIndex) => (
                              <tr
                                key={innerIndex}
                                onClick={() => handleRowClick1(transaction)}
                              >
                                {innerIndex === 0 && (
                                  <td rowSpan={transactionsWithOrderId.length}>
                                    {index + 1}
                                  </td>
                                )}
                                {innerIndex === 0 && (
                                  <td rowSpan={transactionsWithOrderId.length}>
                                    {localStorage.getItem("cust_name")}
                                  </td>
                                )}
                                <td>
                                  {transaction.roller_size &&
                                    transaction.roller_size !== "null" && (
                                      <>
                                        {transaction.roller_size}
                                        {((transaction.pipe_size &&
                                          transaction.pipe_size !== "null") ||
                                          (transaction.cat &&
                                            transaction.cat !== "null") ||
                                          (transaction.roller_name &&
                                            transaction.roller_name !==
                                              "null") ||
                                          (transaction.cap &&
                                            transaction.cap !== "null") ||
                                          (transaction.poly &&
                                            transaction.poly !== "null") ||
                                          (transaction.nutHandle &&
                                            transaction.nutHandle !==
                                              "null")) &&
                                          " --> "}
                                      </>
                                    )}
                                  {transaction.pipe_size &&
                                    transaction.pipe_size !== "null" && (
                                      <>
                                        {transaction.pipe_size}
                                        {((transaction.cat &&
                                          transaction.cat !== "null") ||
                                          (transaction.roller_name &&
                                            transaction.roller_name !==
                                              "null") ||
                                          (transaction.cap &&
                                            transaction.cap !== "null") ||
                                          (transaction.poly &&
                                            transaction.poly !== "null") ||
                                          (transaction.nutHandle &&
                                            transaction.nutHandle !==
                                              "null")) &&
                                          " --> "}
                                      </>
                                    )}
                                  {transaction.cat &&
                                    transaction.cat !== "null" && (
                                      <>
                                        {transaction.cat}
                                        {((transaction.roller_name &&
                                          transaction.roller_name !== "null") ||
                                          (transaction.cap &&
                                            transaction.cap !== "null") ||
                                          (transaction.poly &&
                                            transaction.poly !== "null") ||
                                          (transaction.nutHandle &&
                                            transaction.nutHandle !==
                                              "null")) &&
                                          " --> "}
                                      </>
                                    )}
                                  {transaction.roller_name &&
                                    transaction.roller_name !== "null" && (
                                      <>
                                        {transaction.roller_name}
                                        {((transaction.cap &&
                                          transaction.cap !== "null") ||
                                          (transaction.poly &&
                                            transaction.poly !== "null") ||
                                          (transaction.nutHandle &&
                                            transaction.nutHandle !==
                                              "null")) &&
                                          " --> "}
                                      </>
                                    )}
                                  {transaction.cap &&
                                    transaction.cap !== "null" && (
                                      <>
                                        {transaction.cap}
                                        {transaction.poly &&
                                          transaction.poly !== "null" &&
                                          " --> "}
                                      </>
                                    )}
                                  {transaction.poly &&
                                    transaction.poly !== "null" && (
                                      <>
                                        {transaction.poly}
                                        {transaction.nutHandle &&
                                          transaction.nutHandle !== "null" &&
                                          " --> "}
                                      </>
                                    )}
                                  {transaction.nutHandle &&
                                    transaction.nutHandle !== "null" && (
                                      <>{transaction.nutHandle}</>
                                    )}
                                  {transaction.spray_name &&
                                    transaction.spray_name !== "null" && (
                                      <>{transaction.spray_name}</>
                                    )}
                                  {transaction.tools &&
                                    transaction.tools !== "null" && (
                                      <>{transaction.tools}</>
                                    )}
                                </td>
                                <td>{transaction.amount_to_pay}</td>
                                {innerIndex === 0 && (
                                  <td rowSpan={transactionsWithOrderId.length}>
                                    <div>
                                      <button
                                        className={
                                          transaction.cash_paid >=
                                          transaction.cash_amount
                                            ? "red-text"
                                            : "btn-action"
                                        }
                                        onClick={() => {
                                          handleRowClick(transaction);
                                          if (
                                            transaction.cash_paid !==
                                            transaction.cash_amount
                                          ) {
                                            setShowCashPopup(true);
                                          }
                                        }}
                                        style={{
                                          marginRight: 5,
                                          marginBottom: 2,
                                        }}
                                      >
                                        Cash:{" "}
                                        {transaction.cash_amount -
                                          transaction.cash_paid}
                                      </button>

                                      <button
                                        className={
                                          transaction.cheque_paid >=
                                          transaction.cheque_amount
                                            ? "red-text"
                                            : "btn-action"
                                        }

                                        

                                        onClick={() => {
                                          handleRowClick(transaction);
                                          if (
                                            transaction.cheque_paid !==
                                            transaction.cheque_amount
                                          ) {
                                            setShowChequePopup(true);
                                          }
                                        }}
                                      >
                                        Cheque:{" "}
                                        {transaction.cheque_amount -
                                          transaction.cheque_paid}
                                      </button> 
                                    </div>
                                    <div>
                                      <Link to="/ledgers-invoice">Invoice</Link>
                                    </div>
                                  </td>
                                )}

  {
                        isAdmin ? <td><Link to={`/transactions/edit/${transaction.order_id}`} className="editBtn">Edit</Link></td> : ''
                      }

                                
                              </tr>
                            )
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
                {selectedTransaction && showCashPopup && (
                  <div className="popup open">
                    <div className="popup-content">
                      <div className="popup-header">
                        <h3>Transaction Details</h3>
                        <button
                          className="close-btn"
                          onClick={() => handleClosePopup("cash")}
                        >
                          &times;
                        </button>
                      </div>
                      <p>Amount: {selectedTransaction.cash_amount}</p>
                      <div style={{ marginBottom: 5 }}>
                        <label>Amount to pay:</label>
                        <input
                          type="number"
                          value={cashAmountInput}
                          onChange={(e) => setCashAmountInput(e.target.value)}
                        />
                      </div>
                      <button
                        style={{
                          marginTop: 20,
                          backgroundColor: "navy",
                          color: "white",
                        }}
                        onClick={handleCashSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {selectedTransaction && showChequePopup && (
                  <div className="popup open">
                    <div className="popup-content">
                      <div className="popup-header">
                        <h3>Transaction Details</h3>
                        <button
                          className="close-btn"
                          onClick={() => handleClosePopup("cheque")}
                        >
                          &times;
                        </button>
                      </div>
                      <p>Amount: {selectedTransaction.cheque_amount}</p>
                      <div style={{ marginBottom: 5 }}>
                        <label>Amount to pay:</label>
                        <input
                          type="number"
                          value={chequeAmountInput}
                          onChange={(e) => setChequeAmountInput(e.target.value)}
                        />
                      </div>
                      <button
                        style={{
                          marginTop: 20,
                          backgroundColor: "navy",
                          color: "white",
                        }}
                        onClick={handleChequeSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-transactions-message">
                No transactions currently.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordOfTransactions;
