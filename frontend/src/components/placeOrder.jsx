import React from 'react';
import './../App.css';
import Sidebar from './sidebar';
import Navbar from './navbar';
import SizeCard from './sizeCard';

export default function PlaceOrder() {
  return (
    <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
              <div className="product-container">
                  <SizeCard />
             
        {/* Static cards */}
        
      </div>
    </div>
  </div>
  )
}
