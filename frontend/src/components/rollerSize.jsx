import React, {useEffect, useRef, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


const RollerSizesPage = () => {
  const [rollerSizes, setRollerSizes] = useState([]);

  const hasEffectRun = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rollerstock`);
        if (!response.data || !Array.isArray(response.data)) {
          console.error('Invalid API response:', response.data);
          return;
        }
  
        const rollerSizesSet = new Set(); // Using Set to store unique roller sizes
  
        // Iterate through the response data and add unique roller sizes to the Set
        response.data.forEach(roller => {
          if (!rollerSizesSet.has(roller.roller_size)) {
            rollerSizesSet.add(roller.roller_size);
          }
        });
  
        // Convert Set back to an array
        const rollerSizesArray = Array.from(rollerSizesSet);
  
        console.log('Available roller sizes:', rollerSizesArray);
        setRollerSizes(rollerSizesArray);

      } catch (error) {
        console.error('Error fetching rollerstock data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  
  useEffect(() => {
    if (!hasEffectRun.current) {
      hasEffectRun.current = true;
    }
  });



  const navigate = useNavigate();

  const handleRollerSizeClick = async (selectedRollerSize) => {
    const editArray = JSON.parse(localStorage.getItem('editArray'));
    let billingTableData = JSON.parse(localStorage.getItem('billingTableData')) || [];
  
    if (editArray && editArray.random_id) {
      const editedItemIndex = billingTableData.findIndex((item) => item.random_id === editArray.random_id);

  
      if (editedItemIndex !== -1) {
        billingTableData[editedItemIndex].roller_size = selectedRollerSize;
        localStorage.setItem('selectedRollerSize', selectedRollerSize);

        // Update billingTableData in local storage
        localStorage.setItem('billingTableData', JSON.stringify(billingTableData));
      }
  
      navigate('/place-order/roller-sizes/pipe-size');
    } else {
      console.log("Vani@@@@@@@@")

      const randomId = generateRandomId();
  
      // Save selected roller size in local storage
      localStorage.setItem('selectedRollerSizeId', randomId);
      localStorage.setItem('selectedRollerSize', selectedRollerSize);
  
      navigate('/place-order/roller-sizes/pipe-size');
    }
  };
  

  const generateRandomId = () => {
    return uuidv4();
  };
  

  return (
    <div>
          <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
              <div className="product-container">
              {rollerSizes.map((rollerSize) => (
          <div key={rollerSize}>
            {/* Use a button instead of Link to handle the click event */}
            <div className="card card-body size-card"
              onClick={() => {
                handleRollerSizeClick(rollerSize);
              }}
            >
             <div style={{marginTop: 45, fontSize:20}}> <b>{rollerSize}</b></div>
            </div>
          </div>
        ))}             
        
      </div>
    </div>
  </div>
      
    </div>
  );
};

export default RollerSizesPage;
