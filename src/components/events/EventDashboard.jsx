import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const EventDashboard = () => {
  const [event, setEvent] = useState();
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const token = localStorage.getItem("token");

  const fetchEvent = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events/get-event/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      setEvent(response?.data?.data);
    } catch (error) {
      toast.error(error?.message);
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-4">
      

      <div className="flex flex-wrap gap-4">
        {/* Section 1 - Event Name */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg transition-transform transform hover:scale-105 md:w-1/2">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Event Name</h2>
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-1 w-full mb-4"></div>
          <h5 className="text-xl text-gray-900">{event?.eventName}</h5>
        </div>

        {/* Section 2 - Event Date */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg transition-transform transform hover:scale-105 md:w-1/2">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Event Date</h2>
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-1 w-full mb-4"></div>
          <h5 className="text-xl text-gray-900">
            {new Date(event?.dateOfOrganising).toLocaleDateString()}
          </h5>
        </div>

        <div className="flex-1 bg-white p-6 shadow rounded-lg transition-transform transform hover:scale-105 md:w-1/2">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Total Guests</h2>
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-1 w-full mb-4"></div>
          <h5 className="text-xl text-gray-900">
            {event?.guests.length}
          </h5>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 ">
        {/* Section 1 - Event Name */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg transition-transform transform hover:scale-105 md:w-1/2">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Sucessful Sends</h2>
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-1 w-full mb-4"></div>
          <h5 className="text-xl text-gray-900">900</h5>
        </div>

        {/* Section 2 - Event Date */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg transition-transform transform hover:scale-105 md:w-1/2">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Unsucessful Sends</h2>
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-1 w-full mb-4"></div>
          <h5 className="text-xl text-gray-900">
            34
          </h5>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {/* Section 1 - Event Name */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg transition-transform transform hover:scale-105 md:w-1/2">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Total videos</h2>
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-1 w-full mb-4"></div>
          <h5 className="text-xl text-gray-900">0</h5>
        </div>

        {/* Section 2 - Event Date */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg transition-transform transform hover:scale-105 md:w-1/2">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Total Images</h2>
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-1 w-full mb-4"></div>
          <h5 className="text-xl text-gray-900">
            45
          </h5>
        </div>

        <div className="flex-1 bg-white p-6 shadow rounded-lg transition-transform transform hover:scale-105 md:w-1/2">
          <h2 className="text-gray-700 text-2xl font-bold mb-2">Total Pdf</h2>
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-1 w-full mb-4"></div>
          <h5 className="text-xl text-gray-900">
            5
          </h5>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
