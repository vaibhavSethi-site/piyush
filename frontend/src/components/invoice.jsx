import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const invoiceRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("InvoiceData"));
    if (data) {
      setInvoiceData(data);
    }
  }, []);

  const generatePDF = () => {
    setIsGenerating(true);
    const element = invoiceRef.current;

    const opt = {
      margin: 10,
      filename: "invoice.pdf",
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

  const calculateTotal = () => {
    return invoiceData.reduce(
      (sum, item) => sum + (item.quantity * item.price || 0),
      0
    );
  };

  const calculateGST = (amount) => {
    return amount * 0.18;
  };

  const calculateGrandTotal = () => {
    const total = calculateTotal();
    return total + calculateGST(total);
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
        <h2>TAX INVOICE</h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <p>
            <strong>Customer:</strong> {localStorage.getItem("Name")}
          </p>
          <p>
            <strong>Address:</strong> {localStorage.getItem("Address")}
          </p>
          <p>
            <strong>Phone:</strong> {localStorage.getItem("Phone")}
          </p>
        </div>
        <div>
          <p>
            <strong>Invoice Date:</strong> {new Date().toLocaleDateString()}
          </p>
          <p>
            <strong>Invoice No:</strong> {Math.floor(Math.random() * 10000)}
          </p>
        </div>
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
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>#</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Description
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Quantity
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {index + 1}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.description}
                {item.customDescription && <div>{item.customDescription}</div>}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.quantity}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.price}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.quantity * item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ float: "right", width: "300px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Sub Total:</strong>
          <span>{calculateTotal()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>GST (18%):</strong>
          <span>{calculateGST(calculateTotal())}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #000",
            paddingTop: "5px",
          }}
        >
          <strong>Grand Total:</strong>
          <span>{calculateGrandTotal()}</span>
        </div>
      </div>

      <div style={{ clear: "both", marginTop: "100px", textAlign: "center" }}>
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
        <h2>Invoice Preview</h2>
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

export default Invoice;
