import { describe, expect, it } from "vitest";
import { getMapCenter, getValidMapMarkers } from "../../../src/pages/SharePlanPage/sharePlanMapHelpers";
import { PlanWithDetailedActivities } from "../../../src/types/common";

describe("sharePlanMapHelpers", () => {
  it("filters out activities with invalid coordinates", () => {
    const plan = {
      activities: [
        { activityId: "1", latitude: 51.5, longitude: -0.1, category: "historical" },
        { activityId: "2", latitude: undefined, longitude: -0.2, category: "nature" },
        { activityId: "3", latitude: Number.NaN, longitude: -0.3, category: "nature" },
      ],
    } as PlanWithDetailedActivities;

    const markers = getValidMapMarkers(plan);

    expect(markers).toEqual([
      { activityId: "1", latitude: 51.5, longitude: -0.1, category: "historical" },
    ]);
  });

  it("calculates map center using valid markers and location", () => {
    const center = getMapCenter(
      [
        { activityId: "1", latitude: 10, longitude: 20, category: "nature" },
        { activityId: "2", latitude: 14, longitude: 24, category: "historical" },
      ],
      { latitude: 16, longitude: 26 }
    );

    expect(center).toEqual([23.333333333333332, 13.333333333333334]);
  });

  it("returns null when no valid points are available", () => {
    const center = getMapCenter([], { latitude: Number.NaN, longitude: 10 });

    expect(center).toBeNull();
  });
});
