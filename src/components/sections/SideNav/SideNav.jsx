import "./SideNav.scss";
import React, { useState } from "react";

const SideNav = ({ mode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const isTraveler = mode === "traveler";

  const travelerMenu = [
    { name: "All Trips", key: "trips" },
    { name: "All Tickets", key: "tickets" },
    { name: "Map", key: "map" },
  ];

  const plannerMenu = [
    { name: "All Activities", key: "activities" },
    { name: "Location", key: "location" },
    { name: "Map", key: "map" },
    { name: "Basket", key: "basket" },
    { name: "Close", key: "close" },
  ];

  const menu = isTraveler ? travelerMenu : plannerMenu;

  return (
    <div className="sidebar">
      <button className="sidebar__toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <div className="sidebar__content">
        <div className="sidebar__profile">
          <button className="sidebar__button">User Profile</button>
        </div>
        <div className="sidebar__mode">
          <p>{isTraveler ? "Traveler Mode" : "Planning Mode"}</p>
        </div>
        <ul className="sidebar__menu">
          {menu.map((item) => (
            <li className="sidebar__item" key={item.key}>
              <button className="sidebar__button">{item.name}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar__logout">
        <button className="sidebar__button">Log Out</button>
      </div>
    </div>
  );
};

export default SideNav;
