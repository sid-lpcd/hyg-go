import axios from "axios";
import { formatDateApi } from "./dateFormat";
import { getToken } from "./localStorageHelper";

const API_BASE_URL =
  import.meta.env.VITE_ENV_TYPE === "DEV"
    ? import.meta.env.VITE_HYGGO_API_URL
    : import.meta.env.VITE_HYGGO_API_URL_PRODUCTION;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add an interceptor to include the authorization header
apiClient.interceptors.request.use(
  (config) => {
    const tokenObj = getToken();
    if (tokenObj) {
  config.headers.authorisation = `Bearer ${tokenObj.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const getAllActivities = async (bounds) => {
  const response = await apiClient.get(`${API_BASE_URL}/activities${
    bounds ? `?swLat=${bounds.swLat}&neLat=${bounds.neLat}&swLng=${bounds.swLng}&neLng=${bounds.neLng}` : ""
  }`);
  return response.data;
};


export const addActivity = async (activity) => {
  const response = await apiClient.post(
    `${API_BASE_URL}/activities`,
    activity
  );
  return response.data;
};


export const getActivityById = async (id) => {
  const response = await apiClient.get(`${API_BASE_URL}/activities/${id}`);
  return response.data;
};


export const updateActivity = async (id, updatedActivity) => {
  const response = await apiClient.patch(
    `${API_BASE_URL}/activities/${id}`,
    updatedActivity
  );
  return response.data;
};


export const deleteActivity = async (id) => {
  const response = await apiClient.delete(`${API_BASE_URL}/activities/${id}`);
  return response.data;
};


export const getAllLocations = async (searchQuery = "") => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/locations`, {
      params: { search: searchQuery },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const addLocation = async (location) => {
  const response = await apiClient.post(`${API_BASE_URL}/locations`, location);
  return response.data;
};


export const getLocationById = async (id) => {
  const response = await apiClient.get(`${API_BASE_URL}/locations/${id}`);
  return response.data;
};


export const getLocationByCoordinates = async (lat, lng) => {
  if (!lat || !lng) return null;
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/coordinates?lat=${lat}&lng=${lng}`
  );
  return response.data;
};


export const updateLocation = async (id, updatedLocation) => {
  const response = await apiClient.patch(
    `${API_BASE_URL}/locations/${id}`,
    updatedLocation
  );
  return response.data;
};


export const deleteLocation = async (id) => {
  const response = await apiClient.delete(`${API_BASE_URL}/locations/${id}`);
  return toSnakeCase(response.data);
};


export const getAllCategoriesForLocation = async (locationId) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/categories`
  );
  return response.data;
};


export const getAllActivitiesForLocation = async (
  locationId,
  offset = 0,
  limit = 10
) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/activities`,
    {
      params: {
        offset: offset,
        limit: limit,
      },
    }
  );
  return response.data;
};


export const getAllActivitiesForBounds = async (locationId, bounds) => {
  const response = await apiClient.post(
    `${API_BASE_URL}/locations/${locationId}/activities/bounds`,
    {
      bounds: bounds,
    }
  );
  return response.data;
};


export const getAllPlansForLocation = async (locationId) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/plans`
  );
  return response.data;
};


export const createAIPlan = async (planId) => {
  const response = await apiClient.post(
    `${API_BASE_URL}/plans/${planId}/AI-plan`
  );
  return response.data;
};


export const getAllActivitiesForCategoryForLocation = async (
  locationId,
  category
) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/categories/${category}/activities`
  );
  return response.data;
};


export const getAllPlans = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/plans`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllPlansForUser = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/plans/user`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const addPlan = async (plan) => {
  const newPlan = {
    ...plan,
  startDate: formatDateApi(plan.startDate),
  endDate: formatDateApi(plan.endDate),
  };
  const response = await apiClient.post(`${API_BASE_URL}/plans`, newPlan);
  return response.data;
};


export const getPlanById = async (id) => {
  const response = await apiClient.get(`${API_BASE_URL}/plans/${id}`);
  return response.data;
};


export const updatePlan = async (id, updatedPlan) => {
  const response = await apiClient.patch(`${API_BASE_URL}/plans/${id}`, {
    ...updatedPlan,
  startDate: formatDateApi(updatedPlan.startDate),
  endDate: formatDateApi(updatedPlan.endDate),
  });
  return response.data;
};


export const updatePlanWithActivities = async (id, activities) => {
  const response = await apiClient.patch(
    `${API_BASE_URL}/plans/${id}/activities`,
    activities
  );
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await apiClient.delete(`${API_BASE_URL}/plans/${id}`);
  return response.data;
};


export const getAllPublicPlans = async () => {
  const response = await apiClient.get(`${API_BASE_URL}/public`);
  return response.data;
};


export const getPublicPlanById = async (id) => {
  const response = await apiClient.get(`${API_BASE_URL}/public/${id}`);
  return response.data;
};


export const registerEarlyUser = async (user) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/users/registerEarly`,
      user
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const loginUser = async (user) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/users/login`, user);
    return response;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};


export const registerUser = async (user) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/users/register`,
      user
    );
    return response;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};


export const refreshTokenUser = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/users/refresh`);
    return response;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};


export const updateUser = async (user) => {
  try {
    const response = await apiClient.patch(
  `${API_BASE_URL}/users/${user.userId}`,
      user
    );
    return response;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};


export const getUserProfile = async (authToken) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        authorisation: `Bearer ${authToken}`,
      },
    });
    return response;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
