import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import "./../App.css";
import Card from "./card";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import CapStock from "./capStock";

export default function Inventory() {
  const navigate = useNavigate();

  const rollerStock = () => {
    navigate("/roller-stock");
  };

  const handleCap = () => {
    navigate("/cap-stock");
  };

  const nutStock = () => {
    navigate("/nut-stock");
  };
  const toolStock = () => {
    navigate("/tool-stock");
  };
  const sprayStock = () => {
    navigate("/spray-stock");
  };

  const handlePoly = () => {
    navigate("/poly-stock");
  };

  useEffect(() => {
    console.log("inventory");
  }, []);

  return (
    <div className="app-container">
      <div>
      <Sidebar />

      </div>
      <div className="main-content">
        <Navbar />
        <div class="row" style={{ marginTop: 150, marginLeft: 500 }}>
          <div class="col-sm-3" style={{ marginLeft: 10 }}>
            <div class="card" style={{ height: 200 }}>
              <div
                class="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
                onClick={rollerStock}
              >
                <h5 class="card-title">Roller Stock</h5>
                <p class="card-text"></p>
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
                Checkout stock
              </button>
            </div>
          </div>
          <div class="col-sm-3" style={{ marginLeft: 10 }}>
            <div class="card" style={{ height: 200 }}>
              <div
                class="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
                onClick={handleCap}
              >
                <h5 class="card-title">Cap Stock</h5>
                <p class="card-text"></p>
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
                Checkout stock
              </button>
            </div>
          </div>

          <div class="col-sm-3" style={{ marginLeft: 10 }}>
            <div class="card" style={{ height: 200 }}>
              <div
                class="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
              >
                <h5 class="card-title">Poly Stock</h5>
                <p class="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={handlePoly}
              >
                Checkout stock
              </button>
            </div>
          </div>
        </div>
        <div class="row" style={{  marginLeft: 500 }}>
          <div class="col-sm-3" style={{ marginLeft: 10 }}>
            <div class="card" style={{ height: 200 }}>
              <div
                class="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
                onClick={nutStock}
              >
                <h5 class="card-title">Nut Handle Stock</h5>
                <p class="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={nutStock}
              >
                Checkout stock
              </button>
            </div>
          </div>
          <div class="col-sm-3" style={{ marginLeft: 10 }}>
            <div class="card" style={{ height: 200 }}>
              <div
                class="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
                onClick={toolStock}
              >
                <h5 class="card-title">Tools Stock</h5>
                <p class="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={toolStock}
              >
                Checkout stock
              </button>
            </div>
          </div>

          <div class="col-sm-3" style={{ marginLeft: 10 }}>
            <div class="card" style={{ height: 200 }}>
              <div
                class="card-body"
                style={{ paddingTop: 50, paddingLeft: 60 }}
                onClick={sprayStock}
              >
                <h5 class="card-title">Spray Paint Stock</h5>
                <p class="card-text"></p>
              </div>
              <button
                className="btn btn-inventory "
                style={{
                  backgroundColor: "navy",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={sprayStock}
              >
                Checkout stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
