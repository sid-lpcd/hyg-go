import { useEffect, useState } from "react";
import "./PeopleDropdown.scss";
import Modal from "react-responsive-modal";

export const PeopleDropdown = ({ tripData, setTripData, onClose }) => {
  const [localPeople, setLocalPeople] = useState({
    adults: tripData.adults || 1,
    children: tripData.children || 0,
    infant: tripData.infant || 0,
  });
  const handleChangePeople = (field, value) => {
    if (field === "adults")
      setLocalPeople({
        ...localPeople,
        adults: Math.max(1, localPeople.adults + value),
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
  return (
    <>
      <article className="people-dropdown__container">
        <PeopleControl
          label="Adults (+16yrs):"
          count={localPeople.adults}
          onChange={(val) => handleChangePeople("adults", val)}
          min={1}
        />
        <PeopleControl
          label="Children (2-16yrs):"
          count={localPeople.children}
          onChange={(val) => handleChangePeople("children", val)}
        />
        <PeopleControl
          label="Infant (0-2yrs):"
          count={localPeople.infant}
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

const PeopleControl = ({ label, count, onChange, min = 0 }) => (
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