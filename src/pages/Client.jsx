import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Client = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-100">
                <div className="px-4">
                    <div className="flex items-center mb-4">
                    <img className='w-44' src="/nimantran logo 3.png" alt="" />
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
                    <input type="text" placeholder="Search..." className="px-4 py-2 border rounded-xl w-1/3" />
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
