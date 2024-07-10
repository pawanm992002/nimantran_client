import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/user/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import ClientDashboard from "./components/client/ClientDashboard";
import Register from "./components/user/Register";
import AdminLogin from "./components/admin/AdminLogin";
// import Events from "./pages/events/Events";
import WeddingVideo from "./components/WeddingVideo/WeddingVideo";
import WeddingCard from "./components/WeddingCard/WeddingCard";
import WeddingImage from "./components/WeddingImage/WeddingImage";
import "./App.css";
import "./tailwind.css";

import CustomerDashboard from "./pages/CustomerDashboard";
import Client from "./pages/Client";
import CustomerTable from "./components/client/CustomerTable";
import EventsList from "./components/events/EventsList";

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
        <Route path="/" element={<h1> home page of main site </h1>} />
        <Route path="/admin">
          <Route path="" element={<AdminDashboard />} />
          <Route path="login" element={<AdminLogin />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/events" element={} /> */}

        {/* <Route path="/client" element={<ClientDashboard />} /> */}
        <Route path="/client" element={<Client />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/customers" element={<CustomerTable />} />
          <Route path="/client/eventlist" element={<EventsList />} />
        </Route>

        <Route path="/videoEdit" element={<WeddingVideo />} />
        <Route path="/cardEdit" element={<WeddingCard />} />
        <Route path="/imageEdit" element={<WeddingImage />} />

        {/* <Route path="/:clientId" element={<ClientDashboard />} />
        <Route path="/:clientId/events" element={<h1>client event page</h1>} /> */}

        {/* <Route
          path="/:clientId/:customerId"
          element={<CustomerDashboard />}
        ></Route>
        <Route
          path="/:clientId/:customerId/events"
          element={<h1>customer event page</h1>}
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// <Route path="/:customerId">
//   <Route path="/customer" element={<CustomerDashboard />} />
//   {/* <Route path="/events" element={<h1>customer events</h1>} /> */}
// </Route>
