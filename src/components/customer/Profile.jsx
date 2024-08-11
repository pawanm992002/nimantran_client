import axios from "axios";
import React, { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [customerInfo, setCustomerInfo] = useState({});
  const [params] = useSearchParams();
  const id = params.get("customerId");
  const [credits, setCredits] = useState(0);
  const [purchaseRequestModal, setPurchaseRequestModal] = useState(false);

  const requestCreditFromClient = async (e) => {
    try {
      e.preventDefault();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/purchase-request-from-client`,
        { credits },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Credits purchased");
    } catch (error) {
      toast.error("Error buying credits");
    }
  };

  const fetchCustomerDetails = async () => {
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
              <strong>Gender:</strong>
              {customerInfo.gender}
            </p>
            <p>
              <strong>D.O.B.:</strong>
              {new Date(customerInfo.dateOfBirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {customerInfo.location}
            </p>
          </div>
          {localStorage.getItem("role") === "customer" && (
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={() => setPurchaseRequestModal(true)}
            >
              Request Credit from Client
            </button>
          )}
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
              fontSize: "16px",
              fontWeight: "bold",
            },
          })}
        />
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <p>Credits</p>
          <p>{customerInfo.credits} / 2000</p>
        </div>
      </div>

      {purchaseRequestModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h3 className="text-2xl mb-4">Request Credits from Client</h3>
            <form onSubmit={(e) => requestCreditFromClient(e)}>
              <div className="mb-4">
                <label className="block mb-2">Credits:</label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  min={1}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setPurchaseRequestModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
