import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [dateOfOrganising, setDateOfOrganising] = useState("");
  const [location, setLocation] = useState("");
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

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
      setCurrentStep(2);
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
    <div className="container mx-auto p-6">
      <ol className="flex justify-between items-center w-full mb-6">
        <li className={`flex-1 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'} relative`}>
          <div className={`flex items-center justify-center w-10 h-10 ${currentStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'} rounded-full`}>
            <svg className={`w-4 h-4 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5" />
            </svg>
          </div>
          <div className={`absolute top-1/2 left-10 right-0 h-1 ${currentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
        </li>
        <li className={`flex-1 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'} relative`}>
          <div className={`flex items-center justify-center w-10 h-10 ${currentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'} rounded-full`}>
            <svg className={`w-4 h-4 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
              <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0-2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
            </svg>
          </div>
          <div className={`absolute top-1/2 left-10 right-0 h-1 ${currentStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
        </li>
        <li className="flex-1 text-gray-500 relative">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
            </svg>
          </div>
        </li>
      </ol>

      <h2 className="text-3xl font-semibold mb-6 text-center">Create Event</h2>
      <form onSubmit={handleCreateEvent} className="max-w-3xl mx-auto border bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">
            Event Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">
            Customer <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={customerQuery}
            onChange={(e) => setCustomerQuery(e.target.value)}
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
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
    </div>
  );
};

export default CreateEvent;
