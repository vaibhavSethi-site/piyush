import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import useMountEffect from "./useMount";


import "./../App.css";

export default function Navbar() {
  const navigate = useNavigate();

  useMountEffect(() => {
    console.log('Navbar component mounted');
    // Additional logic if needed
  });


  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("role") === "admin"
  );

  const handleCreateUserClick = () => {
    // Navigate to the create-user page
    navigate("/create-user");
    };
    const handleLogoutClick = () => {
        localStorage.removeItem("role");
        localStorage.clear()
        navigate("/");
      };
    

  return (
    <div className="top-navbar" style={{ display: "flex" }}>
      <h3>Rollers</h3>

      <div className="admin-actions" style={{ marginLeft: "auto", marginRight: "10px" }}>
       
      </div>


   
          <div className="admin-actions" >
           
          <FontAwesomeIcon
            icon={faUserPlus}
            className="create-user-icon"
            onClick={handleCreateUserClick}
            size="2x" style={{marginRight:20}}
          />
        
              
                   <FontAwesomeIcon
          icon={faSignOutAlt}
          className="logout-icon"
          onClick={handleLogoutClick}
          size="2x" style={{marginRight:5}}
              />
                
              </div>
          
    </div>
  );
}
