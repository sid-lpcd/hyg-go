import { useState } from "react";
import "./PeopleDropdown.scss";

export const PeopleDropdown = ({ people, changeCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="people-dropdown">
      <label className="people-dropdown__label" htmlFor="people">
        Number of People:
      </label>
      <div
        className="people-dropdown__summary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {`${people.adults} Adults, ${people.children} Children, ${people.infant} Babies`}
      </div>
      {isOpen && (
        <div className="people-dropdown__container">
          <PeopleControl
            label="Adults (+16yrs):"
            count={people.adults}
            onChange={(val) => changeCount("adults", val)}
          />
          <PeopleControl
            label="Children (2-16yrs):"
            count={people.children}
            onChange={(val) => changeCount("children", val)}
          />
          <PeopleControl
            label="Infant (0-2yrs):"
            count={people.infant}
            onChange={(val) => changeCount("infant", val)}
          />
          <div className="text-center btn-main w-100">
            <a onClick={() => setIsOpen(false)} className="btn w-100">
              Done
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const PeopleControl = ({ label, count, onChange }) => (
  <div className="people-dropdown__control">
    <label className="people-dropdown__label">{label}</label>
    <button
      className="people-dropdown__action"
      type="button"
      onClick={() => onChange(-1)}
      disabled={count === 0}
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
