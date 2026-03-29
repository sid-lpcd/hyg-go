import {
  render,
  fireEvent,
  cleanup,
  screen,
} from "@testing-library/react";
import { PeopleDropdown } from "../../../../src/components/base/PeopleDropdown/PeopleDropdown";
import { vi, describe, expect, beforeEach, test, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { TripData } from "../../../../src/types/common/form";

describe("PeopleDropdown Component", () => {
  let tripData: TripData;
  let setTripData: ReturnType<typeof vi.fn>;
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    tripData = { 
      people: { adult: 2, child: 0, infant: 0 },
      startDate: new Date(),
      endDate: new Date(),
      locationId: "1",
      title: "Test Trip",
      description: "Test Description"
    };
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
    
    // Find children and infant elements by navigating through the DOM structure
    const childrenLabel = screen.getByText(/Children/i);
    const childrenControl = childrenLabel.closest(".people-dropdown__control");
    const childrenElement = childrenControl?.querySelector(".people-dropdown__input");
    
    const infantLabel = screen.getByText(/Infant/i);
    const infantControl = infantLabel.closest(".people-dropdown__control");
    const infantElement = infantControl?.querySelector(".people-dropdown__input");

    expect(adultElement).toBeInTheDocument(); // Adults
    expect(childrenElement).toHaveTextContent("0"); // Children
    expect(infantElement).toHaveTextContent("0"); // Infants
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
    const plusButton = adultControl?.querySelector(
      ".people-dropdown__action:last-child"
    );

    expect(plusButton).toBeInTheDocument();

    if (plusButton) {
      fireEvent.click(plusButton);
      expect(screen.getByText(/3/i)).toBeInTheDocument(); // Adults should now be 3
    }
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
    const minusButton = adultControl?.querySelector(
      ".people-dropdown__action:nth-of-type(1)"
    );

    expect(minusButton).toBeInTheDocument();

    if (minusButton && adultControl) {
      fireEvent.click(minusButton);

      const adultSpan = adultControl.querySelector(".people-dropdown__input");
      expect(adultSpan).toHaveTextContent("1");
    }
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
      people: { adult: 2, child: 0, infant: 0 },
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
