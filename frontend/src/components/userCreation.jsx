import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send POST request to the /createuser endpoint
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/createuser`, {
        username,
        password
      });
      // Check if the request was successful
      if (response.status === 200) {
        // Navigate to the home page or any other appropriate page
        navigate('/home');
      } else {
        // Handle error if needed
        setError('Error creating user');
      }
    } catch (error) {
      // Handle error
      console.error('Error creating user:', error);
      setError('Error creating user');
    }
  };

  return (
    <div className="container-fluid p-3  h-custom">
      <div className="row d-md-flex " style={{ marginBottom: 135 }}>
        <div className="col-sm-10 col-md-5">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid1" alt="Sample image" />
        </div>
        <div className="col-sm-10 col-md-7" style={{ paddingTop: 140, paddingLeft: 90 }}>
          <div>
            <div style={{ paddingRight: 10 }}> Username: </div>
            <input
              type="text"
              placeholder="Enter Username"
              style={{
                borderRadius: 20,
                borderColor: '#474f5c',
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
            <div style={{ paddingRight: 10 }}> Password: </div>
            <input
              type="password"
              placeholder="Enter Password"
              style={{
                borderRadius: 20,
                borderColor: '#474f5c',
                width: 450,
                paddingLeft: 10,
                height: 40,
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br />
          <br />
          <button
            type="submit"
            className='btn '
            style={{
              width: 450, borderRadius: 10, backgroundColor: 'navy',
              height: 50, color: 'white'
            }}
            onClick={handleLogin}
          >Login</button>
        </div>
      </div>
      <div className="footer d-flex flex-column flex-md-row text-center  justify-content-between py-4 px-4 px-xl-5 " style={{ backgroundColor: 'navy', marginTop: 220 }}>
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2023. All rights reserved.
        </div>
        <div>
          <button className="btn btn-link mx-3" style={{ color: 'white' }}>
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="btn btn-link mx-3" style={{ color: 'white' }}>
            <i className="fab fa-twitter"></i>
          </button>
          <button className="btn btn-link mx-3" style={{ color: 'white' }}>
            <i className="fab fa-google"></i>
          </button>
          <button className="btn btn-link mx-3" style={{ color: 'white' }}>
            <i className="fab fa-linkedin-in"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
