import { useEffect, useState } from "react";
import React from "react";
import "./PeopleDropdown.scss";
import { People, PersonType, Plan } from "../../../types/common";

interface PeopleDropdownProps {
  tripData: Partial<Plan>;
  setTripData: (data: Partial<Plan>) => void;
  onClose: () => void;
}

interface PeopleControlProps {
  label: string;
  count: number;
  onChange: (value: number) => void;
  min?: number;
}

export const PeopleDropdown: React.FC<PeopleDropdownProps> = ({ tripData, setTripData, onClose }) => {
  const [localPeople, setLocalPeople] = useState<People>({
    [PersonType.ADULT]: tripData?.people?.[PersonType.ADULT] || 1,
    [PersonType.CHILD]: tripData?.people?.[PersonType.CHILD] || 0,
    [PersonType.INFANT]: tripData?.people?.[PersonType.INFANT] || 0
  });

  const handleChangePeople = (field: keyof People, value: number): void => {
    if (field === PersonType.ADULT)
      setLocalPeople({
        ...localPeople,
        [PersonType.ADULT]: Math.max(1, (localPeople?.[PersonType.ADULT] ?? 1) + value),
      });
    if (field === PersonType.CHILD)
      setLocalPeople({
        ...localPeople,
        [PersonType.CHILD]: Math.max(0, (localPeople?.[PersonType.CHILD] ?? 0) + value),
      });
    if (field === PersonType.INFANT)
      setLocalPeople({
        ...localPeople,
        [PersonType.INFANT]: Math.max(0, (localPeople?.[PersonType.INFANT] ?? 0) + value),
      });
  };

  useEffect(() => {
    if (tripData.people) {
      setLocalPeople({
        [PersonType.ADULT]: tripData.people[PersonType.ADULT] || 1,
        [PersonType.CHILD]: tripData.people[PersonType.CHILD] || 0,
        [PersonType.INFANT]: tripData.people[PersonType.INFANT] || 0,
      });
    }
  }, [tripData]);

  if (!tripData) return null;

  return (
    <>
      <article className="people-dropdown__container">
        <PeopleControl
          label="Adults (+16yrs):"
          count={localPeople?.[PersonType.ADULT]}
          onChange={(val) => handleChangePeople(PersonType.ADULT, val)}
          min={1}
        />
        <PeopleControl
          label="Children (2-16yrs):"
          count={localPeople?.[PersonType.CHILD] ?? 0}
          onChange={(val) => handleChangePeople(PersonType.CHILD, val)}
        />
        <PeopleControl
          label="Infant (0-2yrs):"
          count={localPeople?.[PersonType.INFANT] ?? 0}
          onChange={(val) => handleChangePeople(PersonType.INFANT, val)}
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

export const PeopleControl: React.FC<PeopleControlProps> = ({ label, count, onChange, min = 0 }) => (
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
