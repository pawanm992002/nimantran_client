import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateEventModal = ({ show, onClose, onEventCreated }) => {
  const [eventName, setEventName] = useState("");
  const [dateOfOrganising, setDateOfOrganising] = useState("");
  const [location, setLocation] = useState("");
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const token = localStorage.getItem("token");

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        eventName,
        dateOfOrganising,
        location,
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/events/create-event/${selectedCustomerId}`,
        eventData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Event created successfully");
      onEventCreated();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating event");
    }
  };

  const handleCustomerSearch = async () => {
    try {
      if (customerQuery.trim() === "") {
        setCustomerSuggestions([]);
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/customers/searchCustomers`,
        {
          params: { query: customerQuery },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomerSuggestions(response.data.data);
    } catch (error) {
      console.error("Error searching customers:", error);
    }
  };

  useEffect(() => {
    handleCustomerSearch();
  }, [customerQuery]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create Event</h2>
        <form onSubmit={handleCreateEvent}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date of Organizing
            </label>
            <input
              type="date"
              value={dateOfOrganising}
              onChange={(e) => setDateOfOrganising(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <input
              type="text"
              value={customerQuery}
              onChange={(e) => setCustomerQuery(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            {customerSuggestions.length > 0 && (
              <ul className="mt-2 border border-gray-300 rounded-md bg-white shadow-lg">
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer._id}
                    onClick={() => {
                      setSelectedCustomerId(customer._id);
                      setCustomerQuery(customer.name);
                      setCustomerSuggestions([]);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {customer.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
