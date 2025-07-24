import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";

const LedgersInvoice = () => {
  const [billingTableData, setBillingTableData] = useState([]);
  const invoiceRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const dataFromLocalStorage =
      JSON.parse(localStorage.getItem("ledgersOrder")) || [];
    setBillingTableData(dataFromLocalStorage);
  }, []);

  const generatePDF = () => {
    setIsGenerating(true);
    const element = invoiceRef.current;

    const opt = {
      margin: 10,
      filename: "ledger_invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error("PDF generation failed:", err);
        setIsGenerating(false);
      });
  };

  const generateInvoiceNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const prefix = "INV";
    return `${prefix}-${randomNumber}`;
  };

  const calculateGSTAmount = () => {
    const totalAmount = parseFloat(localStorage.getItem("amountTotal") || 0);
    const cashAmount = parseFloat(localStorage.getItem("cashAmount") || 0);
    const gstAmount = (totalAmount - cashAmount) * 0.18;
    return gstAmount.toFixed(2);
  };

  const calculateTotalWithGST = () => {
    const totalAmount = parseFloat(localStorage.getItem("amountTotal") || 0);
    const cashAmount = parseFloat(localStorage.getItem("cashAmount") || 0);
    const amountForGST = totalAmount - cashAmount;
    return (amountForGST * 1.18).toFixed(2);
  };

  const renderInvoice = () => (
    <div
      ref={invoiceRef}
      style={{
        padding: "20px",
        fontFamily: "Arial",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>LEDGER INVOICE</h2>
        <p>Invoice Number: {generateInvoiceNumber()}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Customer:</strong> {localStorage.getItem("cust_name")}
        </p>
        <p>
          <strong>Company:</strong> {localStorage.getItem("company")}
        </p>
        <p>
          <strong>Phone:</strong> {localStorage.getItem("phone_number")}
        </p>
        <p>
          <strong>City:</strong> {localStorage.getItem("city")}
        </p>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
                width: "50%",
              }}
            >
              Description
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Sub.Description
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Qty
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Price
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {billingTableData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {[
                  item.roller_size,
                  item.pipe_size,
                  item.cat,
                  item.roller_name,
                  item.cap,
                  item.poly,
                  item.nutHandle,
                  item.spray_name,
                  item.tools,
                ]
                  .filter((val) => val && val !== "null")
                  .join(" --> ")}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {item.polybrand || "-"}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {item.price}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ float: "right", width: "300px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Total Amount:</strong>
          <span>{localStorage.getItem("amountTotal")}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Amount (in cash):</strong>
          <span>{localStorage.getItem("cashAmount")}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>GST Amount (18%):</strong>
          <span>{calculateGSTAmount()}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #000",
            paddingTop: "5px",
            marginTop: "5px",
          }}
        >
          <strong>Total with GST:</strong>
          <span>{calculateTotalWithGST()}</span>
        </div>
      </div>

      <div style={{ clear: "both", marginTop: "50px" }}>
        <h3 style={{ textAlign: "center" }}>Billing Calculations</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Description
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Price
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Amount for GST
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                GST Applied
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {billingTableData.map((item, index) => {
              const amountForGST =
                (1 -
                  item.cash_amount /
                    parseFloat(localStorage.getItem("amountTotal"))) *
                item.amount_to_pay;
              const gstApplied = amountForGST * 0.18;
              const totalAmount = amountForGST + gstApplied;

              return (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {[
                      item.roller_size,
                      item.pipe_size,
                      item.cat,
                      item.roller_name,
                      item.cap,
                      item.poly,
                      item.nutHandle,
                      item.spray_name,
                      item.tools,
                    ]
                      .filter((val) => val && val !== "null")
                      .join(" --> ")}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {(
                      (1 -
                        item.cash_amount /
                          parseFloat(localStorage.getItem("amountTotal"))) *
                      item.price
                    ).toFixed(1)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {amountForGST.toFixed(2)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {gstApplied.toFixed(2)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {totalAmount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ clear: "both", marginTop: "50px", textAlign: "center" }}>
        <p>Thank you for your business!</p>
        <p>Terms & Conditions: Payment due within 15 days</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h2>Ledger Invoice Preview</h2>
        <div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              marginRight: "10px",
              padding: "8px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            style={{
              padding: "8px 15px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {showPreview && renderInvoice()}
    </div>
  );
};

export default LedgersInvoice;
