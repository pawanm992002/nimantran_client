import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const ViewGuest = () => {
  const [guests,setGuests] = useState([]);
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const token = localStorage.getItem("token");
  const fetchEvent = async() =>{
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/events/get-event/${eventId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        //   setGuests()
        console.log(response);
        toast(response.message)
    } catch (error) {
        
    }
  }
  return (
    <>
      
    </>
  )
}

export default ViewGuest
