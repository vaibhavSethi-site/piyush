import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import Invoice from "./invoice";
import {
  faCirclePlus,
  faFilePdf,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import PDFComponent from "./invoice";

const BillingPage = () => {
  const hasEffectRun = useRef(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceType, setInvoiceType] = useState("cash");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [customDescription, setCustomDescription] = useState(""); // Add new state for custom description

  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [selectedGST, setSelectedGST] = useState(() => {
    // Get the selected GST percentage from local storage
    const storedGST = localStorage.getItem("selectedGST");
    // If a GST percentage is found in local storage, parse it to a number, otherwise, set the default value to 10
    return storedGST ? Number(storedGST) : 10;
  });

  useEffect(() => {
    // Update the local storage with the selected GST percentage whenever it changes
    localStorage.setItem("selectedGST", selectedGST);
    // Recalculate the amount with GST whenever the selected GST changes
    calculateAmountWithGst();
  }, [selectedGST]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataFromLocalStorage = () => {
      const dataFromLocalStorage = localStorage.getItem("billingTableData");
      if (dataFromLocalStorage) {
        setTableData(JSON.parse(dataFromLocalStorage));
      }
    };

    // Check if it's the initial mount
    if (!hasEffectRun.current) {
      console.log(localStorage.getItem("SelectedPoly"));
      fetchDataFromLocalStorage();

      const selectedItems = [
        localStorage.getItem("selectedRollerSize"),
        localStorage.getItem("selectedPipeSize"),
        localStorage.getItem("selectedCategory"),
        localStorage.getItem("selectedRoller"),
        localStorage.getItem("selectedCap"),
        localStorage.getItem("selectedPoly"),
        localStorage.getItem("nutBolt"),
        localStorage.getItem("spray"),
        localStorage.getItem("tool"),
      ];

      const description = selectedItems
        .filter((item) => item !== null) // Remove null items
        .join(" -- "); // Join the items with arrows

      const generateRandomId = () => {
        return "_" + Math.random().toString(36).substr(2, 9);
      };

      const existingRandomId = localStorage.getItem("random_id");
      if (existingRandomId) {
        // If random_id already exists, skip adding a new row
        console.log("Random ID already exists:", existingRandomId);
        return;
      }

      // Generate unique random ID
      const newRandomId = generateRandomId();
      console.log("Generated Random ID:", newRandomId);

      const newRow = {
        quantity: 1,
        random_id: newRandomId,
        roller_size: `${localStorage.getItem("selectedRollerSize")}`,
        pipe_size: `${localStorage.getItem("selectedPipeSize")}`,
        cat: `${localStorage.getItem("selectedCategory")}`,
        roller_name: `${localStorage.getItem("selectedRoller")}`,
        cap: `${localStorage.getItem("selectedCap")}`,
        poly: `${localStorage.getItem("selectedPoly")}`,
        nutHandle: `${localStorage.getItem("nutBolt")}`,
        spray_name: `${localStorage.getItem("spray")}`,
        tools: `${localStorage.getItem("tool")}`,
        cust_id: `${localStorage.getItem("CUST_ID")}`,
        description: description,
        price: localStorage.getItem("Price"),
        amount: price * quantity,
        gstPercent: selectedGST / 100,
        customDescription: "",
      };

      const storedData = localStorage.getItem("billingTableData");
      const existingData = storedData ? JSON.parse(storedData) : [];

      console.log(storedData, existingData);

      console.log(newRow);

      if (newRow.price !== null) {
        const updatedData = [...existingData, newRow];
        localStorage.setItem("billingTableData", JSON.stringify(updatedData));
        localStorage.setItem("random_id", newRandomId);

        setTableData(updatedData);
        localStorage.setItem(
          "InvoiceData",
          localStorage.getItem("billingTableData")
        );
      }

      hasEffectRun.current = true;
    }
    console.log(tableData);
  }, [price, quantity, setTableData, selectedGST]);

  const updateLocalStorage = (quantityPriceData, billingTableData) => {
    localStorage.setItem(
      "quantityPriceData",
      JSON.stringify(quantityPriceData)
    );
    localStorage.setItem("billingTableData", JSON.stringify(billingTableData));
    localStorage.setItem(
      "InvoiceData",
      localStorage.getItem("billingTableData")
    );
  };

  const handleCustomDescriptionChange = (index, newDescription) => {
    setTableData((prevTableData) => {
      const updatedData = [...prevTableData];
      updatedData[index].customDescription = newDescription; // Update custom description for the specific item
      localStorage.setItem("billingTableData", JSON.stringify(updatedData));
      localStorage.setItem(
        "InvoiceData",
        localStorage.getItem("billingTableData")
      );
      return updatedData;
    });
  };

  const handleDescriptionClick = (description) => {
    console.log("Selected Description:", description);
    // Update state with the clicked description
    setSelectedDescription(description);
    localStorage.setItem("editArray", JSON.stringify(description));

    if (description.roller_size !== "null") {
      navigate("/place-order/roller-sizes");
    } else if (description.roller_size == "null" && description.cap != "null") {
      navigate("/cap-order");
    } else if (
      description.roller_size == "null" &&
      description.poly != "null"
    ) {
      navigate("/poly-order");
    } else if (
      description.roller_size == "null" &&
      description.nutHandle != "null"
    ) {
      navigate("/nut-order");
    } else if (
      description.roller_size == "null" &&
      description.tools != "null"
    ) {
      navigate("/tools");
    } else if (
      description.roller_size == "null" &&
      description.spray_name != "null"
    ) {
      navigate("/spray");
    }
  };

  const handleDelete = (index) => {
    setTableData((prevTableData) => {
      // Create a copy of the previous table data
      const updatedData = [...prevTableData];

      // Remove the item at the specified index
      updatedData.splice(index, 1);

      // Update local storage
      updateLocalStorage1(updatedData);

      return updatedData;
    });
  };

  const updateLocalStorage1 = (billingTableData) => {
    localStorage.setItem("billingTableData", JSON.stringify(billingTableData));
    localStorage.setItem(
      "InvoiceData",
      localStorage.getItem("billingTableData")
    );
  };

  const handleViewInvoiceWithGst = () => {
    localStorage.setItem("mode", "gst");
  };

  const placeOrder = () => {
    const cashAmount = localStorage.getItem("amountInCash");
    const chequeAmount = localStorage.getItem("gstAmount");

    // Save a copy of the data specifically for the invoice before processing
    localStorage.setItem("InvoiceData", JSON.stringify(tableData));

    const orderItems = tableData.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      roller_size: item.roller_size,
      pipe_size: item.pipe_size,
      cat: item.cat,
      roller_name: item.roller_name,
      cap: item.cap,
      poly: item.poly,
      polybrand: item.customDescription,
      nutHandle: item.nutHandle,
      spray_name: item.spray_name,
      tools: item.tools,
      cust_id: item.cust_id,
      amount_to_pay: item.quantity * item.price,
      cash_amount: cashAmount,
      cheque_amount: chequeAmount,
      cash_paid: 0,
      cheque_paid: 0,
    }));

    axios
      .post(`${process.env.REACT_APP_API_URL}/placeOrder`, {
        orders: orderItems,
      })
      .then((response) => {
        console.log("Orders placed successfully:", response.data.orders);
        navigate("/invoice"); // Navigate to invoice FIRST before clearing data
      })
      .catch((error) => {
        console.error(
          "Error placing orders:",
          error.response ? error.response.data : error.message
        );
      });

    // Only clear data AFTER navigation is initiated
    setTimeout(() => {
      localStorage.removeItem("selectedPoly");
      localStorage.removeItem("selectedRollerSize");
      localStorage.removeItem("selectedPipeSize");
      localStorage.removeItem("spray");
      localStorage.removeItem("selectedCategory");
      localStorage.removeItem("tool");
      localStorage.removeItem("Price");
      localStorage.removeItem("random_id");
      localStorage.removeItem("selectedRoller");
      localStorage.removeItem("selectedCap");
      localStorage.removeItem("selectedPoly");
      localStorage.removeItem("nutBolt");
      // Don't remove billingTableData here

      setTableData([]);
    }, 500); // Short timeout to ensure navigation happens first
  };

  const handleEditQuantity = (index, newQuantity) => {
    console.log(index, newQuantity);
    // Parse the input value to ensure it's a valid number
    const parsedQuantity = parseInt(newQuantity, 10);
    const updatedQuantity = isNaN(parsedQuantity) ? "" : parsedQuantity;

    // If the parsed quantity is NaN or negative, set the quantity to 0

    setTableData((prevTableData) => {
      // Create a copy of the previous table data
      const updatedData = [...prevTableData];

      // Update the quantity of the item at the specified index
      updatedData[index].quantity = updatedQuantity;

      // Calculate the new amount based on the updated quantity and price
      updatedData[index].amount = calculateAmount(updatedData[index]);

      // Update local storage if needed
      const updatedQuantityPriceData = updatedData.map(
        ({ quantity, price }) => ({ quantity, price })
      );
      updateLocalStorage(updatedQuantityPriceData, updatedData);

      return updatedData;
    });
  };

  const handlePriceEdit = (index, newPrice) => {
    const parsedPrice = parseFloat(newPrice) || ""; // Parse the input value to float or default to 0
    setTableData((prevTableData) => {
      const updatedData = [...prevTableData];
      updatedData[index].price = parsedPrice; // Set parsed value
      updatedData[index].amount = calculateAmount(updatedData[index]); // Calculate amount
      const updatedQuantityPriceData = updatedData.map(
        ({ quantity, price }) => ({ quantity, price })
      );
      updateLocalStorage(updatedQuantityPriceData, updatedData);
      return updatedData;
    });
  };

  const calculateAmount = (item) => {
    const totalAmountToPay = tableData.reduce(
      (sum, item) => sum + (item.quantity * item.price || 0),
      0
    );

    localStorage.setItem("totalAmountToPay", totalAmountToPay);

    calculateAmountWithGst();
    return item.quantity * item.price;
  };

  const calculateAmountWithGst = () => {
    localStorage.setItem("GstPercent", selectedGST);
    const amountBeforeDiscount = localStorage.getItem("totalAmountToPay");
    const discountAmount = (discountPercentage / 100) * amountBeforeDiscount;
    const amountAfterDiscount = amountBeforeDiscount - discountAmount;

    localStorage.setItem("amountAfterDiscount", amountAfterDiscount);
    localStorage.setItem("discountedAmount", discountAmount);
    const gstAmount = (selectedGST / 100) * amountAfterDiscount;
    localStorage.setItem("onlineAmount", gstAmount.toFixed(2));
    localStorage.setItem(
      "gstAmount",
      (1.18 * parseFloat(gstAmount)).toFixed(2)
    );

    const amountInCash = amountAfterDiscount - gstAmount.toFixed(2);

    localStorage.setItem("amountInCash", amountInCash.toFixed(2));
  };

  const handleAddItem = () => {
    navigate("/cat-order");
    localStorage.removeItem("selectedPoly");
    localStorage.removeItem("selectedRollerSize");
    localStorage.removeItem("selectedPipeSize");
    localStorage.removeItem("spray");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("tool");
    localStorage.removeItem("Price");
    localStorage.removeItem("random_id");

    localStorage.removeItem("selectedRoller");
    localStorage.removeItem("selectedCap");
    localStorage.removeItem("selectedPoly");
    localStorage.removeItem("nutBolt");
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div
          className="billing-container"
          style={{ paddingTop: 15, paddingBottom: 20, marginLeft: 280 }}
        >
          <div>
            <h3>{localStorage.getItem("Name")}</h3>
            <h5 className="mb-4" style={{ color: "navy" }}>
              Product Details
            </h5>
            <table className=" roller-table">
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleEditQuantity(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {item.roller_size && item.roller_size !== "null" && (
                        <>
                          {item.roller_size}
                          {((item.pipe_size && item.pipe_size !== "null") ||
                            (item.cat && item.cat !== "null") ||
                            (item.roller_name && item.roller_name !== "null") ||
                            (item.cap && item.cap !== "null") ||
                            (item.poly && item.poly !== "null") ||
                            (item.nutHandle && item.nutHandle !== "null")) &&
                            " --> "}
                        </>
                      )}
                      {item.pipe_size && item.pipe_size !== "null" && (
                        <>
                          {item.pipe_size}
                          {((item.cat && item.cat !== "null") ||
                            (item.roller_name && item.roller_name !== "null") ||
                            (item.cap && item.cap !== "null") ||
                            (item.poly && item.poly !== "null") ||
                            (item.nutHandle && item.nutHandle !== "null")) &&
                            " --> "}
                        </>
                      )}
                      {item.cat && item.cat !== "null" && (
                        <>
                          {item.cat}
                          {((item.roller_name && item.roller_name !== "null") ||
                            (item.cap && item.cap !== "null") ||
                            (item.poly && item.poly !== "null") ||
                            (item.nutHandle && item.nutHandle !== "null")) &&
                            " --> "}
                        </>
                      )}
                      {item.roller_name && item.roller_name !== "null" && (
                        <>
                          {item.roller_name}
                          {((item.cap && item.cap !== "null") ||
                            (item.poly && item.poly !== "null") ||
                            (item.nutHandle && item.nutHandle !== "null")) &&
                            " --> "}
                        </>
                      )}
                      {item.cap && item.cap !== "null" && (
                        <>
                          {item.cap}
                          {item.poly && item.poly !== "null" && " --> "}
                        </>
                      )}
                      {item.poly && item.poly !== "null" && (
                        <>
                          {item.poly}
                          {item.nutHandle &&
                            item.nutHandle !== "null" &&
                            " --> "}
                        </>
                      )}
                      {item.nutHandle && item.nutHandle !== "null" && (
                        <>{item.nutHandle}</>
                      )}
                      {item.spray_name && item.spray_name !== "null" && (
                        <>{item.spray_name}</>
                      )}
                      {item.tools && item.tools !== "null" && <>{item.tools}</>}
                      <textarea
                        value={item.customDescription}
                        onChange={(e) =>
                          handleCustomDescriptionChange(index, e.target.value)
                        }
                        style={{
                          width: "100%",
                          minHeight: "40px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                          padding: "6px 12px",
                          boxSizing: "border-box",
                        }}
                      />
                    </td>

                    <td>
                      <input
                        value={item.price}
                        type="number"
                        onChange={(e) => handlePriceEdit(index, e.target.value)}
                      />
                    </td>
                    <td>{calculateAmount(item)}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleDescriptionClick(item)} // Define handleEditClick function
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDelete(index)}
                        style={{ cursor: "pointer", marginLeft: 15 }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="icon-plus" onClick={handleAddItem}>
              <FontAwesomeIcon icon={faCirclePlus} />
              Add more items
            </div>

            <div className="mt-5 right-details">
              <div>
                <label style={{ paddingRight: 10 }}>
                  <b>Total Amount:</b>
                </label>
                <span>{localStorage.getItem("totalAmountToPay")}</span>
              </div>
              <div className="d-flex mt-2">
                <label style={{ paddingRight: 10 }}>
                  <b>Discount%:</b>
                </label>
                <input
                  type="text"
                  name="discount"
                  className="discount-border"
                  style={{ width: 70 }}
                  value={discountPercentage}
                  onChange={(e) =>
                    setDiscountPercentage(Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label style={{ paddingRight: 10 }}>
                  <b> Amount(after discount):</b>
                </label>
                <span>{localStorage.getItem("amountAfterDiscount")}</span>
              </div>
              <div>
                <label style={{ paddingRight: 10 }}>
                  <b>%Amount GST:</b>
                </label>
                <select
                  value={selectedGST}
                  onChange={(e) => setSelectedGST(Number(e.target.value))}
                >
                  <option value="10">10%</option>
                  <option value="20">20%</option>
                  <option value="30">30%</option>
                  <option value="40">40%</option>
                  <option value="50">50%</option>
                  <option value="60">60%</option>
                  <option value="70">70%</option>
                  <option value="80">80%</option>
                  <option value="90">90%</option>
                  <option value="100">100%</option>
                </select>
              </div>

              <div className="d-flex">
                <label style={{ paddingRight: 10 }}>
                  <b> Amount(in cash):</b>
                </label>
                <span style={{ paddingRight: 5 }}>
                  {localStorage.getItem("amountInCash")}
                </span>
                {/* Add the following button to view the invoice */}
                {showInvoice && (
                  <PDFComponent type={invoiceType} tableData={tableData} />
                )}
              </div>
              <div>
                <label style={{ paddingRight: 10 }}>
                  <b> Amount(with gst):</b>
                </label>
                <span style={{ paddingRight: 5 }}>
                  {localStorage.getItem("gstAmount")}
                </span>
                <Link
                  to="/invoice"
                  onClick={() => {
                    handleViewInvoiceWithGst();
                    // Make sure invoice data is saved before navigating
                    localStorage.setItem(
                      "InvoiceData",
                      localStorage.getItem("billingTableData")
                    );
                  }}
                >
                  View Invoice
                </Link>
                {/* Add the following button to download the invoice */}
              </div>
            </div>
            <div className="left-btn">
              <button
                type="submit"
                className="btn btn-success"
                onClick={placeOrder}
              >
                Place Order
              </button>
            </div>

            {showInvoice && <Invoice type={invoiceType} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
