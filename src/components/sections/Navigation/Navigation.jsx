import React from "react";
import "./Navigation.scss";
import ListIcon from "../../../assets/icons/list-icon.svg?react";
import MapPinIcon from "../../../assets/icons/map-pin-icon.svg?react";
import BasketIcon from "../../../assets/icons/basket-icon.svg?react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const baseURL = location.pathname.split("/").slice(0, -1).join("/");

  return (
    <nav className="bottom-navigation">
      <Link
        to={`${baseURL}/activities`}
        className={`${
          location.pathname.includes("/activities")
            ? "bottom-navigation__item bottom-navigation__item--active"
            : "bottom-navigation__item"
        }`}
      >
        <ListIcon className="bottom-navigation__icon" />
        <span className="bottom-navigation__label">List</span>
      </Link>
      <Link
        to={`${baseURL}/map`}
        className={`${
          location.pathname.includes("/map")
            ? "bottom-navigation__item bottom-navigation__item--active"
            : "bottom-navigation__item"
        }`}
      >
        <MapPinIcon className="bottom-navigation__icon" />
        <span className="bottom-navigation__label">Map</span>
      </Link>
      <Link
        to={`${baseURL}/basket`}
        className={`${
          location.pathname.includes("/basket")
            ? "bottom-navigation__item bottom-navigation__item--active"
            : "bottom-navigation__item"
        }`}
      >
        <BasketIcon className="bottom-navigation__icon" />
        <span className="bottom-navigation__label">Basket</span>
      </Link>
    </nav>
  );
};

export default Navigation;
