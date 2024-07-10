import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import toast from 'react-hot-toast';

const Profile = () => {
    const token = localStorage.getItem("token");

    const [customerInfo, setCustomerInfo] = useState({});
    const id  = localStorage.getItem("customerId");
    const fetchCustomerDetails = async () => {
      console.log(id);
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/customers/customerInfo/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(data);
        setCustomerInfo(data?.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    useEffect(() => {
      fetchCustomerDetails();
    }, []);
  return (
    <div className="flex mt-4 p-5 h-[60vh] w-[70vw] rounded-lg items-center shadow-lg border">
          <div className="w-1/3 flex flex-col items-center border-r pr-4">
            <div className="rounded-full bg-gray-300 w-24 h-24 flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.208 0 4-1.792 4-4s-1.792-4-4-4-4 1.792-4 4 1.792 4 4 4zm0 2c-3.528 0-6 2.392-6 5.308v.692h12v-.692c0-2.916-2.472-5.308-6-5.308z" />
              </svg>
            </div>

            <h2 className="text-xl font-medium">{customerInfo.name}</h2>
            <p className="text-gray-600">{customerInfo.mobile}</p>
          </div>

          <div className="w-2/3 pl-4">
            <div className="mb-4">
              <div className="space-y-2">
                <p>
                  <strong>Mail ID:</strong> {customerInfo.email}
                </p>
                <p>
                  <strong>Gender:</strong>
                  {customerInfo.gender}
                </p>
                <p>
                  <strong>D.O.B.:</strong>
                  {Date(customerInfo.dateOfBirth)}
                </p>
                <p>
                  <strong>Location:</strong> {customerInfo.location}
                </p>
              </div>
            </div>
          </div>
          <div className="w-56 flex flex-col">
            <CircularProgressbar
              value={(customerInfo.credits / 2000) * 100}
              text={`${Math.round((customerInfo.credits / 2000) * 100)}%`}
              styles={buildStyles({
                display: "flex",
                textColor: "#000",
                pathColor: `rgba(62, 152, 199, ${customerInfo.credits})`,
                trailColor: "#d6d6d6",
                textStyle: {
                  fontSize: '16px',
                  fontWeight: 'bold',
                },
              })}
            />
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <p>Credits</p>
              <p>{customerInfo.credits} / 2000</p>
            </div>
          </div>
        </div>
  )
}

export default Profile
