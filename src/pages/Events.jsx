import { useEffect } from "react";
import { Link, Outlet, useSearchParams, useLocation, useNavigate } from "react-router-dom";

const Events = () => {
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (location.pathname === `/Events` && eventId) {
      navigate(`/events/dashboard?eventId=${eventId}`);
    }
    
  }, [location.pathname, eventId, navigate]);

  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Barra de navegación superior */}
      <div className="bg-white text-white shadow w-full p-2 flex items-center justify-between">
        <div className="flex items-center justify-between" onClick={()=>navigate('/client/dashboard')}>
          <img
            src="/nimantran logo.png"
            alt="Logo"
            className="w-28 h-18 mr-2"
          />
        </div>
           <Link to={role=="client"?'/client/dashboard':'/admin/dashboard'}className="text-blue-500 p-4">&larr; Back</Link>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-wrap">
        {/* Barra lateral de navegación */}
        <div className="p-2 bg-white w-full md:w-60 flex flex-col hidden md:flex" id="sideNav">
          <nav>
            <Link
              className={`block py-2.5 px-4 my-4 rounded transition duration-200 ${
                location.pathname.includes('/events/dashboard')
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-500 text-white'
                  : 'text-gray-500 hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-200 hover:text-white'
              }`}
              to={`/events/dashboard?eventId=${eventId}`}
            >
              <i className="fa fa-home mr-2"></i>Dashboard
            </Link>
            <Link
              className={`block py-2.5 px-4 my-4 rounded transition duration-200 ${
                location.pathname.includes('/events/guests')
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-500 text-white'
                  : 'text-gray-500 hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-200 hover:text-white'
              }`}
              to={`/events/guests?eventId=${eventId}`}
            >
              <i className="fa fa-file-alt mr-2"></i>Guests
            </Link>
            <Link
              className={`block py-2.5 px-4 my-4 rounded transition duration-200 ${
                location.pathname.includes('/events/tracking')
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-500 text-white'
                  : 'text-gray-500 hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-200 hover:text-white'
              }`}
              to={`/events/tracking?eventId=${eventId}`}
            >
              <i className="fa fa-users mr-2"></i>Tracking
            </Link>
          </nav>
        </div>

        {/* Área de contenido principal */}
        <div className="flex-1 p-4 w-full md:w-1/2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Events;
