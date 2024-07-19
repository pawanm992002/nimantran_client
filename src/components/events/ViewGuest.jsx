import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const ViewGuest = () => {
  const [guests, setGuests] = useState([]);
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
      setGuests(response?.data?.data?.guests);
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error?.message);
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-6">Guest List</h1>
      <div className="overflow-x-auto no-scrollbar bg-white shadow rounded-lg" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="min-w-full border-collapse divide-gray-200">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-3 px-5 border-b text-left text-gray-700 font-medium">Name</th>
              <th className="py-3 px-5 border-b text-left text-gray-700 font-medium">Mobile Number</th>
              <th className="py-3 px-5 border-b text-left text-gray-700 font-medium">Image</th>
              <th className="py-3 px-5 border-b text-left text-gray-700 font-medium">Video</th>
              <th className="py-3 px-5 border-b text-left text-gray-700 font-medium">PDF</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <tr key={index} className="text-left hover:bg-gray-50">
                <td className="py-3 px-5 border-b">{guest.name}</td>
                <td className="py-3 px-5 border-b">{guest.mobileNumber}</td>
                <td className="py-3 px-5 border-b">
                  <a
                    href={guest.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {guest.imageUrl ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    ) : 'none'}
                  </a>
                </td>
                <td className="py-3 px-5 border-b">
                  <a
                    href={guest.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {guest.videoUrl ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    ) : 'none'}
                  </a>
                </td>
                <td className="py-3 px-5 border-b">
                  <a
                    href={guest.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {guest.pdfUrl ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    ) : 'none'}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewGuest;
