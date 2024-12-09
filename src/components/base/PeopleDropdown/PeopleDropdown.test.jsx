import {
  render,
  fireEvent,
  findByText,
  cleanup,
  screen,
} from "@testing-library/react";
import { PeopleDropdown } from "./PeopleDropdown";
import { vi, describe, expect, beforeEach, test, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import React from "react";

describe("PeopleDropdown Component", () => {
  let tripData;
  let setTripData;
  let onClose;

  beforeEach(() => {
    tripData = { people: { adult: 2, children: 1, infant: 0 } };
    setTripData = vi.fn();
    onClose = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders with initial trip data", async () => {
    render(
      <PeopleDropdown
        tripData={tripData}
        setTripData={setTripData}
        onClose={onClose}
      />
    );

    screen.debug();

    expect(screen.getByText(/Adults/i)).toBeInTheDocument();
    expect(screen.getByText(/Children/i)).toBeInTheDocument();
    expect(screen.getByText(/Infant/i)).toBeInTheDocument();

    const adultElement = screen.getByText("2", { exact: true });
    const childrenElement = screen.getByText("1", { exact: true });
    const infantElement = screen.getByText("0", { exact: true });

    expect(adultElement).toBeInTheDocument(); // Adults
    expect(childrenElement).toBeInTheDocument(); // Children
    expect(infantElement).toBeInTheDocument(); // Infants
  });

  test("increases adult count", () => {
    render(
      <PeopleDropdown
        tripData={tripData}
        setTripData={setTripData}
        onClose={onClose}
      />
    );

    const adultLabel = screen.getByText(/Adults/i);
    const adultControl = adultLabel.closest(".people-dropdown__control");
    const plusButton = adultControl.querySelector(
      ".people-dropdown__action:last-child"
    );

    expect(plusButton).toBeInTheDocument();

    fireEvent.click(plusButton);
    expect(screen.getByText(/3/i)).toBeInTheDocument(); // Adults should now be 3
  });

  test("decreases adult count but not below min", () => {
    render(
      <PeopleDropdown
        tripData={tripData}
        setTripData={setTripData}
        onClose={onClose}
      />
    );

    const adultLabel = screen.getByText(/Adults/i);
    const adultControl = adultLabel.closest(".people-dropdown__control");
    const minusButton = adultControl.querySelector(
      ".people-dropdown__action:nth-of-type(1)"
    );

    expect(minusButton).toBeInTheDocument();

    fireEvent.click(minusButton);

    const adultSpan = adultControl.querySelector(".people-dropdown__input");
    expect(adultSpan).toHaveTextContent("1");
  });

  test("handles done button click", () => {
    render(
      <PeopleDropdown
        tripData={tripData}
        setTripData={setTripData}
        onClose={onClose}
      />
    );

    const doneButton = screen.getByText(/Done/i);
    fireEvent.click(doneButton);

    expect(setTripData).toHaveBeenCalledWith({
      ...tripData,
      people: { adult: 2, children: 1, infant: 0 },
    });
    expect(onClose).toHaveBeenCalled();
  });

  test("handles cancel button click", () => {
    render(
      <PeopleDropdown
        tripData={tripData}
        setTripData={setTripData}
        onClose={onClose}
      />
    );

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});
