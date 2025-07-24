import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';
import Navbar from './navbar';

const CategoryPage = () => {
  // State to store the rollerSize, pipeSize, and selectedCategory
  const[cat, setCat]=useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  
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
        
        const filteredData = response.data.filter(item => 
            item.roller_size === selectedRollerSize && 
            item.pipe_size === selectedPipeSize
        );
        console.log(filteredData);
          
        const categorySet = new Set(filteredData.map(item => item.cat));
        const catArray = Array.from(categorySet);

        // Update state with the filtered categories
        setCat(catArray);
        console.log(cat)

      } catch (error) {
        console.error('Error fetching rollerstock data:', error);
      }
    };

    fetchData();
  }, []); 

  


  // Empty dependency array means this effect runs once when the component mounts

  // Find the data for the selected rollerSize and pipeSize
  

  const handleCategoryClick = (category) => {

    const editArray = JSON.parse(localStorage.getItem('editArray'));
    let billingTableData = JSON.parse(localStorage.getItem('billingTableData')) || [];
  
    if (editArray && editArray.random_id) {
      const editedItemIndex = billingTableData.findIndex((item) => item.random_id === editArray.random_id);
  
      if (editedItemIndex !== -1) {
        billingTableData[editedItemIndex].cat = category;
        localStorage.setItem('selectedCategory', category);

        // Update billingTableData in local storage
        localStorage.setItem('billingTableData', JSON.stringify(billingTableData));
      }
  
      navigate('/place-order/roller-sizes/pipe-sizes/categories/roller-name')
    } 

    else {
          // Store the selectedCategory in local storage
    localStorage.setItem('selectedCategory', category);

    // Update the state with the selectedCategory
    setSelectedCategory(category);

    // Navigate to the next page (replace the path with the desired path)
    navigate('/place-order/roller-sizes/pipe-sizes/categories/roller-name')
}

  };

    return (
      
        <div>
        <div className="app-container">
  <Sidebar />
  <div className="main-content">
    <Navbar />
            <div className="product-container">
            {cat.map((category) => (
        <div className='card card-body size-card' key={category} onClick={() => handleCategoryClick(category)}>
         <div style={{marginTop:45, fontSize:20}}><b> {category}</b></div>
        </div>
      ))}        
      
    </div>
  </div>
</div>
    
  </div>

  
  );
};

export default CategoryPage;
