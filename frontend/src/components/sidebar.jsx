import React from 'react';
import './../App.css'
import { useNavigate , Link} from "react-router-dom";



const Sidebar = () => {
  const navigate = useNavigate();
 const navigateHome= ()=>{
    navigate("/home")
  }
  const goToLedgers = () => {
    navigate("/transactions")
  }

  const goToInventory = () => {
    navigate("/inventory")
  }

  return (
    <div className="sidebar open" style={{ position: "fixed", top: 0, left: 0 }}>
      <ul>
        <li onClick={navigateHome}>Home</li>
        <li onClick={goToLedgers}>Ledgers</li>
        <li onClick={goToInventory}>Inventory</li>
        {/* Add more menu items as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
