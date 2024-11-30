import { useState } from "react";
import "./PeopleDropdown.scss";
import ProfileIcon from "../../../assets/icons/profile-icon.svg?react";
import Modal from "react-responsive-modal";

export const PeopleDropdown = ({ people, changeCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="people-dropdown" onClick={() => setIsOpen(!isOpen)}>
      <ProfileIcon className="people-dropdown__icon" />
      <p className="people-dropdown__summary">
        {`${people.adults} Adults, ${people.children} Children, ${people.infant} Infants`}
      </p>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        showCloseIcon={false}
        classNames={{
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <article className="people-dropdown__container">
          <PeopleControl
            label="Adults (+16yrs):"
            count={people.adults}
            onChange={(val) => changeCount("adults", val)}
            min={1}
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

          <button
            onClick={() => setIsOpen(false)}
            className="people-dropdown__btn-done"
          >
            Done
          </button>
        </article>
      </Modal>
    </div>
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
