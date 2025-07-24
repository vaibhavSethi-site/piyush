import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/loginUser`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data && response.data.login) {
        // Changed Login to login
        // Store the token in localStorage if you need it
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/home");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Check for specific error responses from the backend
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while logging in");
      }
    }
  };

  return (
    <div className="container-fluid p-3  h-custom">
      <div className="row d-md-flex " style={{ marginBottom: 135 }}>
        <div className="col-sm-10 col-md-5">
          <img
            src="http://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid1"
            alt="Sample image"
          />
        </div>
        <div
          className="col-sm-10 col-md-7"
          style={{ paddingTop: 140, paddingLeft: 90 }}
        >
          <div>
            <div style={{ paddingRight: 10 }}> Username: </div>
            <input
              type="text"
              placeholder="Enter Username"
              style={{
                borderRadius: 20,
                borderColor: "#474f5c",
                width: 450,
                paddingLeft: 10,
                height: 40,
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <br />
          <div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password type
                placeholder="Enter Password"
                style={{
                  borderRadius: 20,
                  borderColor: "#474f5c",
                  width: 450,
                  paddingLeft: 10,
                  height: 40,
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                style={{
                  position: "absolute",
                  top: 8,
                  left: 400,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <br></br>
          <br></br>
          <button
            type="submit"
            className="btn "
            style={{
              width: 450,
              borderRadius: 10,
              backgroundColor: "navy",
              height: 50,
              color: "white",
            }}
            onClick={handleLogin}
          >
            Login!
          </button>
        </div>
      </div>
      <div
        className="footer d-flex flex-column flex-md-row text-center  justify-content-between py-4 px-4 px-xl-5 "
        style={{ backgroundColor: "navy", marginTop: 220 }}
      >
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2023. All rights reserved.
        </div>
        <div>
          <button className="btn btn-link mx-3" style={{ color: "white" }}>
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="btn btn-link mx-3" style={{ color: "white" }}>
            <i className="fab fa-twitter"></i>
          </button>
          <button className="btn btn-link mx-3" style={{ color: "white" }}>
            <i className="fab fa-google"></i>
          </button>
          <button className="btn btn-link mx-3" style={{ color: "white" }}>
            <i className="fab fa-linkedin-in"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
