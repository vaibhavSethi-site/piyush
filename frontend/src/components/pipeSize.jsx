import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';
import axios from 'axios';

const PipeSizes = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [rollerSize, setRollerSize] = useState('');
  const[pipeSize, setPipeSizes]=useState([]);
  const [selectedPipeSize, setSelectedPipeSize] = useState('');
  const hasEffectRun = useRef(false);

  useEffect(() => {

    if (!hasEffectRun.current) {
      console.log("u.e1")
      const storedRollerSize = localStorage.getItem('selectedRollerSize');

      setRollerSize(storedRollerSize);
      hasEffectRun.current = true;
      console.log("u.e2")


    }

    
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rollerstock`);
  
        if (!response.data || !Array.isArray(response.data)) {
          console.error('Invalid API response:', response.data);
          return;
        }
  
        // Logging the response data
        console.log(response.data);
  
        // Filter the response data based on rollerSize
        const filteredData = response.data.filter(item => item.roller_size === localStorage.getItem("selectedRollerSize"));
  
        // Extract the unique pipe_size values from the filtered data
        const pipeSizesSet = new Set(filteredData.map(item => item.pipe_size));
        
        // Convert Set to array
        const pipeSizes = Array.from(pipeSizesSet);
  
        // Update state with the filtered pipe sizes
        setPipeSizes(pipeSizes);
  
        // Now console.log(pipeSizes) will always show the correct array
        console.log(pipeSizes);
      } catch (error) {
        console.error('Error fetching rollerstock data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  


  

  

  // Find the data for the selected rollerSize
  

  const handlePipeSizeClick = (pipeSize) => {

    // Update the state with the selected pipeSize

    const editArray = JSON.parse(localStorage.getItem('editArray'));
    let billingTableData = JSON.parse(localStorage.getItem('billingTableData')) || [];
  
    if (editArray && editArray.random_id) {
      const editedItemIndex = billingTableData.findIndex((item) => item.random_id === editArray.random_id);
  
      if (editedItemIndex !== -1) {
        billingTableData[editedItemIndex].pipe_size = pipeSize;
        localStorage.setItem('selectedPipeSize', pipeSize);

        // Update billingTableData in local storage
        localStorage.setItem('billingTableData', JSON.stringify(billingTableData));
      }
  
      navigate('/place-order/roller-sizes/pipe-sizes/categories')
    } 
    else {
      setSelectedPipeSize(pipeSize);

    // Store the selected pipeSize in local storage
      localStorage.setItem('selectedPipeSize', pipeSize);
      navigate('/place-order/roller-sizes/pipe-sizes/categories')
    }
  };

    return (
        <div>
        <div className="app-container">
  <Sidebar />
  <div className="main-content">
    <Navbar />
            <div className="product-container">
            {
        pipeSize.map((pipe) => (
          <div key={pipe}>
                <div className="card card-body size-card" onClick={() => handlePipeSizeClick(pipe)}>
                    <div style={{marginTop:45, fontSize: 20}}><b>{pipe}</b></div>

            </div>
          </div>
        ))}         
      
    </div>
  </div>
</div>
    
  </div>
   
  );
};

export default PipeSizes;
