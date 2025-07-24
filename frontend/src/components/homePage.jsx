import React, {useEffect} from 'react'
import Sidebar from './sidebar';
import './../App.css';
import Card from './card';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';




export default function HomePage() {

    const isAdmin = localStorage.getItem("role") === "admin";


  const navigate = useNavigate();
  
  useEffect(() => { 
    console.log("home")
  }, [])

    const handleInventoryClick = () => {
        // Navigate to the /rollers route
        navigate('/inventory');
  };
  
  const handlePlaceOrder = () => {
    navigate('/place-order/customer-details');
  }

  const handleLedgers = () => {
    navigate('/transactions');
  }
    
  return (
    <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <div class="row" style={{marginTop: 150, marginLeft: 500}}>
  <div class="col-sm-3" style={{marginLeft: 10}}>
    <div class="card" style={{height:200}}>
      <div class="card-body" style={{paddingTop: 50, paddingLeft: 60}}>
        <h5 class="card-title">Inventory</h5>
        <p class="card-text"></p>
        <button
                  className="btn btn-md"
                  style={{ backgroundColor: 'navy', color: 'white' }}
                  onClick={handleInventoryClick}
                >Go</button></div>
    </div>
                  </div>

{
                        isAdmin ? (
 <div class="col-sm-3" style={{marginLeft: 10}}>
    <div class="card" style={{height:200}}>
      <div class="card-body" style={{paddingTop: 50, paddingLeft: 60}}>
        <h5 class="card-title">Place your order</h5>
        <p class="card-text"></p>
        <button class="btn btn-md" style={{backgroundColor:'navy', color:'white'}} onClick={handlePlaceOrder}>Go </button>      </div>
    </div>
                  </div>
                        ) : ''
                      }

                 

  <div class="col-sm-3" style={{marginLeft: 10}}>
    <div class="card" style={{height:200}}>
      <div class="card-body" style={{paddingTop: 50, paddingLeft: 60}}>
        <h5 class="card-title">Ledgers</h5>
        <p class="card-text"></p>
        <a href="#" class="btn btn-md" style={{backgroundColor:'navy', color:'white'}} onClick={handleLedgers}>Go </a>      </div>
    </div>
                  </div>
</div>
    </div>
  </div>
  )
}
