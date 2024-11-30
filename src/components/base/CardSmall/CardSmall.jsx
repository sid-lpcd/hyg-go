import React from "react";
import FlameIcon from "../../../assets/icons/fire-icon.svg?react";
import "./CardSmall.scss";

const CardSmall = ({ plan }) => {
  const { title, location, likes, image_url, user } = plan;

  return (
    <article className="card">
      <div
        className="card__background"
        style={{ backgroundImage: `url(${image_url})` }}
      >
        <div className="card__overlay"></div>
      </div>
      <div className="card__content">
        <div>
          <h3 className="card__title">{title}</h3>
          <p className="card__location">{location}</p>
        </div>

        <div className="card__footer">
          <div className="card__user-info">
            <img
              src={user.profile_image}
              alt={`${user.name}'s profile`}
              className="card__user-image"
            />
            <p className="card__user-name">{user.name}</p>
          </div>
          <div className="card__likes">
            <FlameIcon className="card__flame-icon" />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardSmall;
