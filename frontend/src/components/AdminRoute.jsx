import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const AdminRoute = ({
    children
}) => {

    const navigator = useNavigate();
    
    useEffect(()=>{
        const authToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if(!authToken){
        alert("Please login !");
        navigator("/")
        return;
    }

    if(!role || role !== "admin"){
         alert("Only Admin can access this page");
        navigator("/home");
        return;

    }
    }, [navigator])


  return (
    <div>
      {children}
    </div>
  )
}

export default AdminRoute
