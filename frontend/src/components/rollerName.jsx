import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';
import Navbar from './navbar';

const RollersPage = ({ pipeSizes }) => {
  // State to store the rollerSize, pipeSize, category, and selected roller name
  const [rollerSize, setRollerSize] = useState('');
  const [pipeSize, setPipeSize] = useState('');
  const [category, setCategory] = useState('');
  const [selectedRoller, setSelectedRoller] = useState('');
  const[name, setName]=useState([]);


  
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

        // Filter the response data based on rollerSize and pipeSize
        const selectedRollerSize = localStorage.getItem("selectedRollerSize");
        const selectedPipeSize = localStorage.getItem("selectedPipeSize");
        const selectedCategory = localStorage.getItem("selectedCategory");
        
        const filteredData = response.data.filter(item => 
            item.roller_size === selectedRollerSize && 
            item.pipe_size === selectedPipeSize && item.cat ===  selectedCategory
        );
        console.log(filteredData);
          
        const nameSet = new Set(filteredData.map(item => item.roller_name));
        const nameArray = Array.from(nameSet);
        console.log(nameArray);

        // Update state with the filtered categories
        setName(nameArray);
        console.log(name)

      } catch (error) {
        console.error('Error fetching rollerstock data:', error);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    console.log(name);
  }, [name]);

  


  const navigate = useNavigate();



  const handleRollerClick = async (rollerName) => {
    try {
      const editArray = JSON.parse(localStorage.getItem('editArray'));
      let billingTableData = JSON.parse(localStorage.getItem('billingTableData')) || [];
      let oldPrice = 0;
      console.log(localStorage.getItem('Price'))

      
      if (editArray && editArray.random_id) {
        const editedItemIndex = billingTableData.findIndex((item) => item.random_id === editArray.random_id);
    
        if (editedItemIndex !== -1) {
          billingTableData[editedItemIndex].roller_name = rollerName;

          const selectedRollerSize = localStorage.getItem("selectedRollerSize");
          const selectedPipeSize = localStorage.getItem("selectedPipeSize");
          const selectedCategory = localStorage.getItem("selectedCategory");

      
          // Fetch the rollerstock data from the API
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rollerstock`);
          const rollerStockData = response.data;
      
          // Find the entry matching the selected criteria
          const selectedRollerEntry = rollerStockData.find(item =>
            item.roller_size === selectedRollerSize &&
            item.pipe_size === selectedPipeSize &&
            item.cat === selectedCategory &&
            item.roller_name === rollerName
          );

          if (selectedRollerEntry) {
            console.log('Selected Roller Price:', selectedRollerEntry.Price);
            const newPrice =  selectedRollerEntry.Price;
            billingTableData[editedItemIndex].price = newPrice;

            localStorage.setItem('Price', newPrice);
            navigate('/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page');

          } else {
            console.log('Selected roller not found in rollerstock data.');
          }

          // Update billingTableData in local storage
          localStorage.setItem('billingTableData', JSON.stringify(billingTableData));
        }
    
      } 
      else {
        localStorage.setItem('selectedRoller', rollerName);
  
        // Retrieve the selected roller's size, pipe size, and category from local storage
        const selectedRollerSize = localStorage.getItem("selectedRollerSize");
        const selectedPipeSize = localStorage.getItem("selectedPipeSize");
        const selectedCategory = localStorage.getItem("selectedCategory");
    
        // Fetch the rollerstock data from the API
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rollerstock`);
        const rollerStockData = response.data;
    
        // Find the entry matching the selected criteria
        const selectedRollerEntry = rollerStockData.find(item =>
          item.roller_size === selectedRollerSize &&
          item.pipe_size === selectedPipeSize &&
          item.cat === selectedCategory &&
          item.roller_name === rollerName
        );
    
        // Log the price of the selected roller to the console
        if (selectedRollerEntry) {
          console.log('Selected Roller Price:', selectedRollerEntry.Price);
          localStorage.setItem('Price', selectedRollerEntry.Price);
          navigate('/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page');
        } else {
          console.log('Selected roller not found in rollerstock data.');
        }
      } 
    } catch (error) {
      console.error('Error fetching rollerstock data:', error);
    }
  };
  
  

    return (
      
        <div>
        <div className="app-container">
  <Sidebar />
  <div className="main-content">
    <Navbar />
            <div className="product-container">
            {name.map((roller_name) => (
        <div className='card card-body size-card' key={roller_name} onClick={() => handleRollerClick(roller_name)}>
         <div style={{marginTop:45, fontSize:20}}><b> {roller_name}</b></div>
        </div>
      ))}    
      
    </div>
  </div>
</div>
    
  </div>
   
  );
};

export default RollersPage;
