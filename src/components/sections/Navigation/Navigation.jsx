import React, { useEffect, useState } from "react";
import "./Navigation.scss";
import ListIcon from "../../../assets/icons/list-icon.svg?react";
import MapPinIcon from "../../../assets/icons/map-pin-icon.svg?react";
import BasketIcon from "../../../assets/icons/basket-icon.svg?react";
import HomeIcon from "../../../assets/icons/home-icon.svg?react";
import WalletIcon from "../../../assets/icons/wallet-icon.svg?react";
import { Link, useLocation } from "react-router-dom";

const Navigation = ({ basketState, pageType = "create" }) => {
  const location = useLocation();
  const baseURL = location.pathname.split("/").slice(0, -1).join("/");

  const [basketItems, setBasketItems] = useState(0);

  const updateBasketIcon = () => {
    setTimeout(() => setBasketItems(basketState.activities.length), 1000);
  };

  useEffect(() => {
    if (!basketState) return;
    updateBasketIcon();
  }, [basketState]);

  if (pageType === "create") {
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
          <span className="bottom-navigation__count">{basketItems}</span>
          <BasketIcon className="bottom-navigation__icon" />
          <span className="bottom-navigation__label">Basket</span>
        </Link>
      </nav>
    );
  } else {
    return (
      <nav className="bottom-navigation bottom-navigation--travel">
        <Link
          to={`${baseURL}/`}
          className={`${
            location.pathname === "/"
              ? "bottom-navigation__item bottom-navigation__item--active"
              : "bottom-navigation__item"
          }`}
        >
          <HomeIcon className="bottom-navigation__icon" />
          <span className="bottom-navigation__label">Home</span>
        </Link>
        <Link
          to={`${baseURL}/wallet`}
          className={`${
            location.pathname.includes("/wallet")
              ? "bottom-navigation__item bottom-navigation__item--active"
              : "bottom-navigation__item"
          }`}
        >
          <WalletIcon className="bottom-navigation__icon" />
          <span className="bottom-navigation__label">Wallet</span>
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
      </nav>
    );
  }
};

export default Navigation;
