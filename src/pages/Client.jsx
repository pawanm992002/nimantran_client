import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Client = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-100">
                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7v7c0 5 3.58 9.33 8 9.93 4.42-.6 8-4.93 8-9.93V7L12 2z" />
                        </svg>
                        <span className="text-xl font-bold ml-2 ">Nimantran</span>
                    </div>
                    <nav className="space-y-2 pt-5">
                        <Link 
                            to="/client/dashboard" 
                            className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${currentPath === "/client/dashboard" ? "bg-gray-200" : ""}`}
                        >
                            <span className="mr-2">🏠</span> Dashboard
                        </Link>
                    
                        <Link 
                            to="/client/customers" 
                            className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${currentPath === "/client/customers" ? "bg-gray-200" : ""}`}
                        >
                            <span className="mr-2">👥</span> End Users
                        </Link>
                        <Link 
                            to="/client/eventlist" 
                            className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${currentPath === "/client/eventlist" ? "bg-gray-200" : ""}`}
                        >
                            <span className="mr-2">🎊</span> Events
                        </Link>
                        <Link 
                            to="/client/credits" 
                            className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${currentPath === "/client/credits" ? "bg-gray-200" : ""}`}
                        >
                            <span className="mr-2">💲</span> Credits
                        </Link>
                        <Link 
                            to="/client/reports" 
                            className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${currentPath === "/client/reports" ? "bg-gray-200" : ""}`}
                        >
                            <span className="mr-2">📊</span> Reports
                        </Link>
                    </nav>
                   
                </div>
            </aside>
            <main className="flex-1 p-6 bg-white">
                <header className="flex items-center justify-between mb-6">
                    <input type="text" placeholder="Search..." className="px-4 py-2 border rounded-md w-1/3" />
                    <div className="flex items-center">
                       
                        <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full mr-2" src="https://via.placeholder.com/32" alt="Profile" />
                            <span>Nimantran</span>
                        </div>
                    </div>
                </header>
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-[80vh]">
                    {/* components */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Client;
