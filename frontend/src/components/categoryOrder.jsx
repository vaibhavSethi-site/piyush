import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import "./../App.css";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";

export default function CategoryOrder() {
  const navigate = useNavigate();

  const rollerStock = () => {
    navigate("/place-order/roller-sizes");
  };

  const nutOrder = () => {
    navigate("/nut-order");
  };

  const handleCap = () => {
    navigate("/cap-order");
  };

  const polyOrder = () => {
    navigate("/poly-order");
  };
  const tools = () => {
    navigate("/tools");
  };
  const spray = () => {
    navigate("/spray");
  };

  useEffect(() => {
    console.log("inventory");
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="row" style={{ marginTop: 100, marginLeft: 500 }}>
          <div className="col-sm-3" style={{ marginLeft: 10 }}>
            <div className="card" style={{ height: 200 }}>
              <div
                className="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
                onClick={rollerStock}
              >
                <h5 className="card-title">Rollers</h5>
                <p className="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={rollerStock}
              >
                Make order
              </button>
            </div>
          </div>
          <div className="col-sm-3" style={{ marginLeft: 10 }}>
            <div className="card" style={{ height: 200 }}>
              <div
                className="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
                onClick={handleCap}
              >
                <h5 className="card-title">Cap Stock</h5>
                <p className="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={handleCap}
              >
                Place Order
              </button>
            </div>
          </div>

          <div className="col-sm-3" style={{ marginLeft: 10 }}>
            <div className="card" style={{ height: 200 }}>
              <div
                className="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
              >
                <h5 className="card-title">Poly</h5>
                <p className="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={polyOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginLeft: 500 }}>
          <div className="col-sm-3" style={{ marginLeft: 10 }}>
            <div className="card" style={{ height: 200 }}>
              <div
                className="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
              >
                <h5 className="card-title">Handles</h5>
                <p className="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={nutOrder}
              >
                Make order
              </button>
            </div>
          </div>
          <div className="col-sm-3" style={{ marginLeft: 10 }}>
            <div className="card" style={{ height: 200 }}>
              <div
                className="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
              >
                <h5 className="card-title">Tools</h5>
                <p className="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={tools}
              >
                Place Order
              </button>
            </div>
          </div>

          <div className="col-sm-3" style={{ marginLeft: 10 }}>
            <div className="card" style={{ height: 200 }}>
              <div
                className="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
              >
                <h5 className="card-title">Spray Paint</h5>
                <p className="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={spray}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
