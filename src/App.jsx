import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/user/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import ClientDashboard from "./components/client/ClientDashboard";
import Register from "./components/user/Register";
import AdminLogin from "./components/admin/AdminLogin";
import WeddingVideo from "./components/WeddingVideo/WeddingVideo";
import WeddingCard from "./components/WeddingCard/WeddingCard";
import WeddingImage from "./components/WeddingImage/WeddingImage";
import Client from "./pages/Client";
import CustomerTable from "./components/customer/CustomerTable";
import EventsList from "./components/events/EventsList";
import "./App.css";
import "./tailwind.css";


import Customer from "./pages/Customer";
import Profile from "./components/customer/Profile";
import EditProfileCustomer from "./components/customer/EditProfileCustomer";
import CustomerEvents from "./components/customer/CustomerEvents";
import ErrorPage from "./pages/ErrorPage";
import LandingPage from "./pages/LandingPage";
import Transactions from "./components/transiction/Transactions";
import ClientCredits from "./components/client/ClientCredits";
import UsersTable from "./components/admin/UsersTable";
import Admin from "./pages/Admin";
import AdminEvents from "./components/admin/AdminEvents";
import AdminTransaction from "./components/admin/AdminTransaction";
import Events from "./pages/Events";
import EventDashboard from "./components/events/EventDashboard";
import GuestsList from "./components/events/GuestsList";
import CreateEvent from "./pages/CreateEvent";
import EventLayout from "./pages/EventLayout";
import MediaGrid from "./components/mediaGrid/MediaGrid";

export const fontFamilies = [
  "Josefin Slab",
  "Phudu",
  "Londrina Shadow",
  "Carattere",
  "Permanent Marker",
  "Noto Serif",
  "Playfair Display",
  "Ubuntu",
  "Roboto",
  "Alkatra",
  "Tilt Warp",
  "Kalnia",
  "Grenze Gotisch",
  "Antonio",
  "Genos",
  "Podkova",
  "Ojuju",
  "Changa",
  "DynaPuff",
  "Danfo",
  "Jaro",
  "Edu QLD Beginner",
  "Edu VIC WA NT Beginner",
  "Edu SA Beginner",
  "Grandstander",
  "Merienda",
  "Edu TAS Beginner",
  "Caveat",
  "Dancing Script",
];

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="adminLogin" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="userDetails" element={<UsersTable />} />
          <Route path="eventlist" element={<AdminEvents />} />
          <Route path="credits" element={<AdminTransaction />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/events" element={} /> */}
        {/* <Route path="/client" element={<ClientDashboard />} /> */}
        <Route path="/client" element={<Client />}>
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="customers" element={<CustomerTable />} />
          <Route path="eventlist" element={<EventsList />} />
          <Route path="credits" element={<ClientCredits />} />
        </Route>
        <Route path="/event" element={<EventLayout />}>
          <Route path="createEvent" element={<CreateEvent />} />
          <Route path="imageEdit" element={<WeddingImage />} />
          <Route path="videoEdit" element={<WeddingVideo />} />
          <Route path="cardEdit" element={<WeddingCard />} />
          <Route path="mediaGrid" element={<MediaGrid />} />
        </Route>

        <Route path="/customer" element={<Customer />}>
          <Route path="profile" element={<Profile />} />
          <Route path="editProfile" element={<EditProfileCustomer />} />
          <Route path="events" element={<CustomerEvents />} />
          <Route path="credits" element={<Transactions />} />
        </Route>
        <Route path="/events" element={<Events />}>
          <Route path="dashboard" element={<EventDashboard />} />
          <Route path="guests" element={<GuestsList />} />
          <Route path="dashboard" element={<EventDashboard />} />
        </Route>

        <Route path="/videoEdit" element={<WeddingVideo />} />
        <Route path="/cardEdit" element={<WeddingCard />} />
        <Route path="/imageEdit" element={<WeddingImage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
