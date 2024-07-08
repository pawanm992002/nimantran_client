import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function Events() {
  const token = localStorage.getItem("token");
  const eventNameRef = useRef();
  const dateOfOrganisingRef = useRef();
  const fileInputRef = useRef();
  const [eventData, setEventData] = useState([]);
  const [id , setId] = useState('');
  
  const createEvent = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }

    const eventName = eventNameRef.current.value;
    const dateOfOrganising = dateOfOrganisingRef.current.value;
    const file = fileInputRef.current.files[0];

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("dateOfOrganising", dateOfOrganising);
    if (file) {
      formData.append("guestNames", file);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/events/create-event`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      getEvents(); // Refresh the events list after creating a new event
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  const getEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events/get-all-events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setEventData(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error?.message || "An error occurred"
      );
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const updateEvent = async (event) => {
    event.preventDefault();
    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }
    const eventName = eventNameRef.current.value;
    const dateOfOrganising = dateOfOrganisingRef.current.value;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/events/update-event/${id}`,
        {
          eventName,
          dateOfOrganising,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data)
      setEventData(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  const deleteEvent =async (event) =>{
    event.preventDefault();
    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }


    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/events/delete-event/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
  
  return (
    <div>
      <h1>{id}</h1>
      <form onSubmit={createEvent}>
        <label htmlFor="eventName">Event Name</label>
        <input type="text" id="eventName" ref={eventNameRef} />
        <label htmlFor="dateOfOrganising">Organising Date</label>
        <input type="date" id="dateOfOrganising" ref={dateOfOrganisingRef} />
        <label htmlFor="file">Upload File</label>
        <input type="file" id="file" ref={fileInputRef} name="guestNames" />
        <input type="submit" value="Create Event" />
      </form>
    </div>
  );
}
