// src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink exact to="/" activeClassName="active-link">
        Events
      </NavLink>
      <NavLink to="/about" activeClassName="active-link">
        Organisors
      </NavLink>
      {/* <NavLink to="/contact" activeClassName="active-link">
        Contact
      </NavLink> */}
    </div>
  );
};

export default Sidebar;
