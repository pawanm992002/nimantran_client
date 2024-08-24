import axios from "axios";
import React, { useEffect, useState } from "react";
import EditEventModal from "../events/EditEventModal";
import CreateEventModal from "../events/CreateEventModal";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const CustomerEvents = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const id = params.get("customerId");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/customers/customerEvents/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const customerData = response?.data?.data;
      setCustomer(customerData);
      setEvents(customerData?.events || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [id, token]);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleDeleteEvent = async (event) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/events/delete-event/${event._id}/${customer._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(events.filter((e) => e._id !== event._id));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    }
  };

  const handleEventUpdated = () => {
    fetchEvents();
  };

  const handleEventCreated = () => {
    fetchEvents();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    ); // Show a loading indicator while data is being fetched
  }

  return (
    <div className="w-full flex flex-wrap overflow-scroll no-scrollbar h-full justify-around p-4">
      {events.length > 0 ? (
        events.map((event) => (
          <div
            key={event._id}
            className="bg-white border rounded-lg gap-2 shadow-lg flex flex-col p-2 md:w-[45%] m-2 transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/event/${event.editType}?eventId=${event._id}`)}
          >
            {/* <div className="flex self-end gap-2">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors duration-300"
                onClick={() => handleEditClick(event)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors duration-300"
                onClick={() => handleDeleteEvent(event)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div> */}
            <div className="bg-blue-50 p-2 rounded-lg mb-2 h-16">
              <h3 className="text-blue-500 text-md font-semibold mb-1">
                Event Name:
              </h3>
              <p className="text-gray-800 text-sm">{event.eventName}</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg mb-2">
              <h3 className="text-blue-500 text-md font-semibold mb-1">
                Date:
              </h3>
              <p className="text-gray-800 text-sm">
                {new Date(event.dateOfOrganising).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg mb-2 h-16">
              <h3 className="text-blue-500 text-md font-semibold mb-1">
                Location:
              </h3>
              <p className="text-gray-800 text-sm">{event.location}</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg mb-2 h-16">
              <h3 className="text-blue-500 text-md font-semibold mb-1">
                Media Type:
              </h3>
              <p className="text-gray-800 text-sm">{event.editType}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-4xl">No events Yet!</h1>
        </div>
      )}
      {/* <EditEventModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        event={selectedEvent}
        customerId={customer._id}
        onEventUpdated={handleEventUpdated}
      />
      <CreateEventModal
        show={showCreateModal}
        onClose={handleCloseCreateModal}
        onEventCreated={handleEventCreated}
      /> */}
    </div>
  );
};

export default CustomerEvents;
