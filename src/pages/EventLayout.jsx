import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const EventLayout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("/event/createEvent")) {
      setCurrentStep(1);
    } else if (
      pathname.includes("/event/imageEdit") ||
      pathname.includes("/event/videoEdit") ||
      pathname.includes("/event/cardEdit")
    ) {
      setCurrentStep(2);
    } else if (pathname.includes("/event/mediaGrid")) {
      setCurrentStep(3);
    } else if (pathname.includes("/event/invitationTracker")) {
      setCurrentStep(4);
    }
  }, [location.pathname]);
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <ol className="flex justify-between items-center w-[80vw] mb-3">
        <li
          className={`flex-1 ${
            currentStep >= 1 ? "text-blue-600" : "text-gray-500"
          } relative`}
        >
          <div
            className={`flex items-center justify-center w-10 h-10 ${
              currentStep >= 1 ? "bg-blue-100" : "bg-gray-100"
            } rounded-md w-max p-2`}
          >
            <svg
              className={`w-4 h-4 ${
                currentStep >= 1 ? "text-blue-600" : "text-gray-500"
              } mr-2`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
            Create Event
          </div>
          <div
            className={`absolute top-1/2 left-10 right-0 h-1 ${
              currentStep >= 2 ? "bg-blue-100" : "bg-gray-100"
            } z-[-1]`}
          ></div>
        </li>
        <li
          className={`flex-1 ${
            currentStep >= 2 ? "text-blue-600" : "text-gray-500"
          } relative`}
        >
          <div
            className={`flex items-center justify-center w-10 h-10 ${
              currentStep >= 2 ? "bg-blue-100" : "bg-gray-100"
            } rounded-md w-max p-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-4 h-4 ${
                currentStep >= 2 ? "text-blue-600" : "text-gray-500"
              } mr-2`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Edit Media
          </div>
          <div
            className={`absolute top-1/2 left-10 right-0 h-1 ${
              currentStep >= 3 ? "bg-blue-100" : "bg-gray-100"
            } z-[-1]`}
          ></div>
        </li>
        <li
          className={`flex-1 ${
            currentStep >= 3 ? "text-blue-600" : "text-gray-500"
          } relative`}
        >
          <div
            className={`flex items-center justify-center w-10 h-10 ${
              currentStep >= 3 ? "bg-blue-100" : "bg-gray-100"
            } rounded-md w-max p-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-4 h-4 ${
                currentStep >= 3 ? "text-blue-600" : "text-gray-500"
              } mr-2`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            View Media
          </div>
          <div
            className={`absolute top-1/2 left-10 right-0 h-1 ${
              currentStep >= 3 ? "bg-blue-100" : "bg-gray-100"
            } z-[-1]`}
          ></div>
        </li>
        <li
          className={`flex-1 ${
            currentStep >= 4 ? "text-blue-600" : "text-gray-500"
          } relative`}
        >
          <div
            className={`flex items-center justify-center w-10 h-10 ${
              currentStep >= 4 ? "bg-blue-100" : "bg-gray-100"
            } rounded-md w-max p-2`}
          >
            <svg
              className={`w-4 h-4 ${
                currentStep >= 4 ? "text-blue-600" : "text-gray-500"
              } mr-2`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0-2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
            </svg>
            Track Invitations
          </div>
          <div
            className={`absolute top-1/2 left-10 right-0 h-1 ${
              currentStep >= 4 ? "bg-blue-100" : "bg-gray-100"
            } z-[-1]`}
          ></div>
        </li>
        <li className="flex text-gray-500 relative">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
            </svg>
          </div>
        </li>
      </ol>
      <div className="w-full flex justify-center">
        {/* components */}
        <Outlet />
      </div>
    </div>
  );
};

export default EventLayout;
