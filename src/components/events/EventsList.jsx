// EventsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/events/get-all-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    
<div className='w-full'>
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-lg flex flex-col p-4 w-full md:w-2/4 m-8">
            <div className="w-full m-4 flex gap-6">
              <div className='h-1/2 '>
              <div className="bg-blue-50 p-2 rounded-lg mb-2 h-16">
                <h3 className="text-blue-500 text-md font-semibold mb-1">Event Name:</h3>
                <p className="text-gray-800 text-sm">{event.eventName}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg mb-2">
                <h3 className="text-blue-500 text-md font-semibold mb-1">Date:</h3>
                <p className="text-gray-800 text-sm">{new Date(event.dateOfOrganising).toLocaleDateString()}</p>
              </div>
              </div>
              <div>
              <div>
              <div className="bg-blue-50 p-2 rounded-lg mb-2 w-64 h-16">
                <h3 className="text-blue-500 text-md font-semibold mb-1">Location:</h3>
                <p className="text-gray-800 text-sm">{event.location}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg mb-2 w-64 h-16">
                <h3 className="text-blue-500 text-md font-semibold mb-1">Description:</h3>
                <p className="text-gray-800 text-sm">{event.description}</p>
              </div>
              </div>
              </div>
            </div>
          </div>
        ))}
   </div>   
  
  );
};

export default EventsList;
