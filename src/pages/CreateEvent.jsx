import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CreateCustomerJSX from "../components/Other/CreateCustomerModal/CreateCustomerModal";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [dateOfOrganising, setDateOfOrganising] = useState("");
  const [location, setLocation] = useState("");
  const [editType, setEditType] = useState("imageEdit");
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false)

  const token = localStorage.getItem("token");

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        eventName,
        dateOfOrganising,
        location,
        editType,
      };

      const response = await axios.post(
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
      navigate(`/event/${editType}?eventId=${response?.data?.data?._id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event");
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

  return (
    <div>
      {console.log("uuuuuuuuuuuuuuuu", )}
      <h2 className="text-3xl font-semibold mb-6 text-center">Create Event</h2>
      <form
        onSubmit={handleCreateEvent}
        className="mx-auto border bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">
            Event Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="flex justify-between text-lg font-medium text-gray-700">
            <span> Customer <span className="text-red-600">*</span> </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              onClick={() => setShowCreateCustomerModal(true)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </label>

          <input
            type="text"
            value={customerQuery}
            onChange={(e) => setCustomerQuery(e.target.value)}
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
          />
          {customerSuggestions.length > 0 && (
            <ul className="mt-2 border border-gray-300 rounded-md bg-white shadow-lg max-h-40 overflow-y-auto">
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
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">
            Date of Organising
          </label>
          <input
            type="date"
            value={dateOfOrganising}
            onChange={(e) => setDateOfOrganising(e.target.value)}
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">
            What do want to Edit ?<span className="text-red-600">*</span>
          </label>
          <select
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            onClick={(e) => setEditType(e.target.value)}
          >
            <option value="imageEdit">Image Edit</option>
            <option value="videoEdit">Video Edit</option>
            <option value="cardEdit">Pdf Edit</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Create Event
          </button>
        </div>
      </form>
      <CreateCustomerJSX showModal={showCreateCustomerModal} setShowModal={setShowCreateCustomerModal} />
    </div>
  );
};

export default CreateEvent;
