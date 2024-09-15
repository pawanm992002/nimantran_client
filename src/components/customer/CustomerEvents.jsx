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
  const [searchItem, setsearchItem] = useState("");
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
      const sortedEvents = sortEvents(customerData?.events || []);
      setEvents(sortedEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [id, token]);
  const sortEvents = (events) => {
    return events.slice().sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
  };
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
      <div className="flex h-full w-full justify-center items-center">
        <div className="spinner"></div> {/* Spinner */}
      </div>
    );
  }
  const filteredEvents = events.filter((event) =>
    event?.eventName?.toLowerCase().includes(searchItem?.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full">
      {events.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-x-2"
              >
                Event Name
                <input
                  type="text"
                  className="px-2 py-1 rounded-full border-[1px] border-gray-400"
                  placeholder="Search here"
                  onChange={(e) => setsearchItem(e.target?.value?.trim())}
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Media Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event._id} className="hover:bg-gray-100">
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={() =>
                    navigate(`/event/${event.editType}?eventId=${event._id}`)
                  }
                >
                  {event.eventName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.dateOfOrganising
                    ? new Date(event.dateOfOrganising).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.editType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-4xl">No events Yet!</h1>
        </div>
      )}
      <EditEventModal
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
      />
    </div>
  );
};

export default CustomerEvents;
