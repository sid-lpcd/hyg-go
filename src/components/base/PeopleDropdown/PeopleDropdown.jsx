import { useEffect, useState } from "react";
import React from "react";
import "./PeopleDropdown.scss";

export const PeopleDropdown = ({ tripData, setTripData, onClose }) => {
  const [localPeople, setLocalPeople] = useState({
    adult: tripData?.people.adult || 1,
    children: tripData?.people.children || 0,
    infant: tripData?.people.infant || 0,
  });
  const handleChangePeople = (field, value) => {
    if (field === "adult")
      setLocalPeople({
        ...localPeople,
        adult: Math.max(1, localPeople.adult + value),
      });
    if (field === "children")
      setLocalPeople({
        ...localPeople,
        children: Math.max(0, localPeople.children + value),
      });
    if (field === "infant")
      setLocalPeople({
        ...localPeople,
        infant: Math.max(0, localPeople.infant + value),
      });
  };

  useEffect(() => {
    setLocalPeople(tripData.people);
  }, [tripData]);

  if (!tripData) return null;

  return (
    <>
      <article className="people-dropdown__container">
        <PeopleControl
          label="Adults (+16yrs):"
          count={localPeople?.adult}
          onChange={(val) => handleChangePeople("adult", val)}
          min={1}
        />
        <PeopleControl
          label="Children (2-16yrs):"
          count={localPeople?.children}
          onChange={(val) => handleChangePeople("children", val)}
        />
        <PeopleControl
          label="Infant (0-2yrs):"
          count={localPeople?.infant}
          onChange={(val) => handleChangePeople("infant", val)}
        />
        <div className="people-dropdown__btn-container">
          <button
            onClick={onClose}
            className="people-dropdown__btn people-dropdown__btn--inactive"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setTripData({ ...tripData, people: localPeople });
              onClose();
            }}
            className="people-dropdown__btn"
          >
            Done
          </button>
        </div>
      </article>
    </>
  );
};

export const PeopleControl = ({ label, count, onChange, min = 0 }) => (
  <div className="people-dropdown__control">
    <label className="people-dropdown__label">{label}</label>
    <button
      className="people-dropdown__action"
      type="button"
      onClick={() => onChange(-1)}
      disabled={count === min}
    >
      -
    </button>
    <span className="people-dropdown__input">{count}</span>
    <button
      className="people-dropdown__action"
      type="button"
      onClick={() => onChange(1)}
    >
      +
    </button>
  </div>
);
