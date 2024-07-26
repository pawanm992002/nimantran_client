import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';

const EventLayout = () => {
    const [currentStep, setCurrentStep] = useState(1);
  return (
    <div className='h-full w-full flex flex-col items-center justify-center p-4'>
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
        <li className={`flex-1 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'} relative`}>
          <div className={`flex items-center justify-center w-10 h-10 ${currentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'} rounded-full`}>
            <svg className={`w-4 h-4 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
              <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0-2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
            </svg>
          </div>
          <div className={`absolute top-1/2 left-10 right-0 h-1 ${currentStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
        </li>
        <li className={`flex-1 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'} relative`}>
          <div className={`flex items-center justify-center w-10 h-10 ${currentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'} rounded-full`}>
            <svg className={`w-4 h-4 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
              <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0-2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
            </svg>
          </div>
          <div className={`absolute top-1/2 left-10 right-0 h-1 ${currentStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
        </li>
        <li className="flex text-gray-500 relative">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
            </svg>
          </div>
        </li>
      </ol>
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-[83vh] w-full ">
          {/* components */}
          <Outlet />
        </div>
    </div>
  )
}

export default EventLayout
