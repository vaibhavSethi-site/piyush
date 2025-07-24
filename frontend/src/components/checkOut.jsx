import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from './sidebar';
import Navbar from './navbar';
import './../App.css'

const CheckoutPage = () => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value, 10)) || 1);
  };

  const handleCheckout = () => {
    // Handle the checkout logic here
    console.log(`Checkout for ${quantity} paint rollers`);
  };

    return (
        <>
             <Navbar />
      <div className="container-fluid  h-custom d-md-flex">
          <Sidebar />
      <div className="row">
        {/* Left side with image */}
        <div className="col-md-4 p-5 ">
          <img
            src="https://www.rollerwall.com/cdn/shop/files/pattern-roller-and-applicator_600x600.jpg?v=1613507302"
            alt="Roller Image"
            className="img-fluid1 mt-5"
          />
        </div>

        {/* Right side with content */}
        <div className="col-md-8 d-flex align-items-center justify-content-center ">
          <div className="text-center">
            {/* <h2 className="mb-4">Checkout</h2> */}
            <div className="product-details ">
              <h3 className="mb-2">Product Name</h3>
              <p className="text-muted mb-2"><b>Description: : a roller that consists typically of a rotating cylinder about two inches in diameter and six inches in length covered with an absorbent material and mounted on a handle so that the cylinder can be dipped into paint or otherwise (as through a hollow feeding center) be supplied with paint and rolled over a flat surface ...

 </b> </p>
              <p className="text-muted">Price: $15.99</p>
            </div>
            <div className="quantity mb-3 d-flex">
              <label htmlFor="quantity" className="mb-2 mr-5">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="form-control" size={{width:500, marginLeft: 10}}
              />
            </div>
            <div className="total mb-4">
              <p className="mb-2">Total: ${(quantity * 15.99).toFixed(2)}</p>
            </div>
            <button className="btn btn-primary" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
        </>
  );
};

export default CheckoutPage;
