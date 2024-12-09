import axios from "axios";
import { formatDateApi } from "./dateFormat";

const API_BASE_URL =
  import.meta.env.VITE_ENV_TYPE === "DEV"
    ? import.meta.env.VITE_HYGGO_API_URL
    : import.meta.env.VITE_HYGGO_API_URL_PRODUCTION;

export const getAllAttractions = async () => {
  const response = await axios.get(`${API_BASE_URL}/attractions`);
  return response.data;
};

export const addAttraction = async (attraction) => {
  const response = await axios.post(`${API_BASE_URL}/attractions`, attraction);
  return response.data;
};

export const getAttractionById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/attractions/${id}`);
  return response.data;
};

export const updateAttraction = async (id, updatedAttraction) => {
  const response = await axios.patch(
    `${API_BASE_URL}/attractions/${id}`,
    updatedAttraction
  );
  return response.data;
};

export const deleteAttraction = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/attractions/${id}`);
  return response.data;
};

export const getAllLocations = async (searchQuery = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/locations`, {
      params: { search: searchQuery },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addLocation = async (location) => {
  const response = await axios.post(`${API_BASE_URL}/locations`, location);
  return response.data;
};

export const getLocationById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/locations/${id}`);
  return response.data;
};

export const updateLocation = async (id, updatedLocation) => {
  const response = await axios.patch(
    `${API_BASE_URL}/locations/${id}`,
    updatedLocation
  );
  return response.data;
};

export const deleteLocation = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/locations/${id}`);
  return response.data;
};

export const getAllCategoriesForLocation = async (locationId) => {
  const response = await axios.get(
    `${API_BASE_URL}/locations/${locationId}/categories`
  );
  return response.data;
};

export const getAllAttractionsForLocation = async (
  locationId,
  offset = 0,
  limit = 10
) => {
  console.log("limit", limit);
  const response = await axios.get(
    `${API_BASE_URL}/locations/${locationId}/attractions`,
    {
      params: {
        offset: offset,
        limit: limit,
      },
    }
  );
  return response.data;
};

export const getAllAttractionsForBounds = async (locationId, bounds) => {
  const response = await axios.post(
    `${API_BASE_URL}/locations/${locationId}/attractions/bounds`,
    {
      bounds: bounds,
    }
  );
  return response.data;
};

export const getAllPlansForLocation = async (locationId) => {
  const response = await axios.get(
    `${API_BASE_URL}/locations/${locationId}/plans`
  );
  return response.data;
};

export const getAIPlan = async (planId) => {
  const response = await axios.get(`${API_BASE_URL}/plans/${planId}/AI-plan`);
  return response.data;
};

export const getAllAttractionsForCategoryForLocation = async (
  locationId,
  category
) => {
  const response = await axios.get(
    `${API_BASE_URL}/locations/${locationId}/categories/${category}/attractions`
  );
  return response.data;
};

export const getAllPlans = async () => {
  const response = await axios.get(`${API_BASE_URL}/plans`);
  return response.data;
};

export const addPlan = async (plan) => {
  const newPlan = {
    ...plan,
    start_date: formatDateApi(plan.start_date),
    end_date: formatDateApi(plan.end_date),
  };
  const response = await axios.post(`${API_BASE_URL}/plans`, newPlan);
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/plans/${id}`);
  return response.data;
};

export const updatePlan = async (id, updatedPlan) => {
  const response = await axios.patch(`${API_BASE_URL}/plans/${id}`, {
    ...updatedPlan,
    start_date: formatDateApi(updatedPlan.start_date),
    end_date: formatDateApi(updatedPlan.end_date),
  });
  return response.data;
};

export const updatePlanWithActivities = async (id, basket) => {
  const response = await axios.patch(
    `${API_BASE_URL}/plans/${id}/activities`,
    basket
  );
  return response.data;
};

export const updatePlanWithActivitiesCalendar = async (
  id,
  activities_linked
) => {
  const response = await axios.patch(
    `${API_BASE_URL}/plans/${id}/activities-calendar`,
    activities_linked
  );
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/plans/${id}`);
  return response.data;
};

export const getAllPublicPlans = async () => {
  const response = await axios.get(`${API_BASE_URL}/public`);
  return response.data;
};

export const getPublicPlanById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/public/${id}`);
  return response.data;
};
