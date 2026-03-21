import { Location, MapMarker, PlanWithDetailedActivities } from "../../types/common";

const isFiniteCoordinate = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const getValidMapMarkers = (
  plan: PlanWithDetailedActivities | null
): MapMarker[] => {
  if (!plan) return [];

  return plan.activities
    .filter(
      (activity) =>
        isFiniteCoordinate(activity.latitude) &&
        isFiniteCoordinate(activity.longitude)
    )
    .map((activity) => ({
      activityId: activity.activityId,
      latitude: activity.latitude,
      longitude: activity.longitude,
      category: activity.category,
    }));
};

export const getMapCenter = (
  mapMarkers: MapMarker[],
  location: Pick<Location, "latitude" | "longitude"> | undefined
): [number, number] | null => {
  const coordinates: Array<{ latitude: number; longitude: number }> = [...mapMarkers];

  if (isFiniteCoordinate(location?.latitude) && isFiniteCoordinate(location?.longitude)) {
    coordinates.push({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  if (!coordinates.length) return null;

  const avgLat =
    coordinates.reduce((sum, point) => sum + point.latitude, 0) /
    coordinates.length;
  const avgLng =
    coordinates.reduce((sum, point) => sum + point.longitude, 0) /
    coordinates.length;

  return [avgLng, avgLat];
};
