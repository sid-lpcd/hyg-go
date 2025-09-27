import axios from "axios";
import { formatDateApi } from "./dateFormat";
import { useAuth } from "../context/AuthContext";
import { getToken } from "./localStorageHelper";

// Helper to convert object keys from camelCase to snake_case recursively
function toSnakeCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj && typeof obj === "object" && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([A-Z])/g, "_$1").toLowerCase(),
        toSnakeCase(value),
      ])
    );
  }
  return obj;
}

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
    console.log("API Helper - Token:", tokenObj);
    if (tokenObj) {
      config.headers.authorisation = `Bearer ${tokenObj.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const getAllAttractions = async () => {
  const response = await apiClient.get(`${API_BASE_URL}/attractions`);
  return toSnakeCase(response.data);
};


export const addAttraction = async (attraction) => {
  const response = await apiClient.post(
    `${API_BASE_URL}/attractions`,
    attraction
  );
  return toSnakeCase(response.data);
};


export const getAttractionById = async (id) => {
  const response = await apiClient.get(`${API_BASE_URL}/attractions/${id}`);
  return toSnakeCase(response.data);
};


export const updateAttraction = async (id, updatedAttraction) => {
  const response = await apiClient.patch(
    `${API_BASE_URL}/attractions/${id}`,
    updatedAttraction
  );
  return toSnakeCase(response.data);
};


export const deleteAttraction = async (id) => {
  const response = await apiClient.delete(`${API_BASE_URL}/attractions/${id}`);
  return toSnakeCase(response.data);
};


export const getAllLocations = async (searchQuery = "") => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/locations`, {
      params: { search: searchQuery },
    });
    return toSnakeCase(response.data);
  } catch (error) {
    throw error;
  }
};


export const addLocation = async (location) => {
  const response = await apiClient.post(`${API_BASE_URL}/locations`, location);
  return toSnakeCase(response.data);
};


export const getLocationById = async (id) => {
  const response = await apiClient.get(`${API_BASE_URL}/locations/${id}`);
  return toSnakeCase(response.data);
};


export const getLocationByCoordinates = async (lat, lng) => {
  if (!lat || !lng) return null;
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/coordinates?lat=${lat}&lng=${lng}`
  );
  return toSnakeCase(response.data);
};


export const updateLocation = async (id, updatedLocation) => {
  const response = await apiClient.patch(
    `${API_BASE_URL}/locations/${id}`,
    updatedLocation
  );
  return toSnakeCase(response.data);
};


export const deleteLocation = async (id) => {
  const response = await apiClient.delete(`${API_BASE_URL}/locations/${id}`);
  return toSnakeCase(response.data);
};


export const getAllCategoriesForLocation = async (locationId) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/categories`
  );
  return toSnakeCase(response.data);
};


export const getAllAttractionsForLocation = async (
  locationId,
  offset = 0,
  limit = 10
) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/attractions`,
    {
      params: {
        offset: offset,
        limit: limit,
      },
    }
  );
  return toSnakeCase(response.data);
};


export const getAllAttractionsForBounds = async (locationId, bounds) => {
  const response = await apiClient.post(
    `${API_BASE_URL}/locations/${locationId}/attractions/bounds`,
    {
      bounds: bounds,
    }
  );
  return toSnakeCase(response.data);
};


export const getAllPlansForLocation = async (locationId) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/plans`
  );
  return toSnakeCase(response.data);
};


export const getAIPlan = async (planId) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/plans/${planId}/AI-plan`
  );
  return toSnakeCase(response.data);
};


export const getAllAttractionsForCategoryForLocation = async (
  locationId,
  category
) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/categories/${category}/attractions`
  );
  return toSnakeCase(response.data);
};


export const getAllPlans = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/plans`);
    return toSnakeCase(response.data);
  } catch (error) {
    throw error;
  }
};


export const getAllPlansForUser = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/plans/user`);
    return toSnakeCase(response.data);
  } catch (error) {
    throw error;
  }
};


export const addPlan = async (plan) => {
  const newPlan = {
    ...plan,
    start_date: formatDateApi(plan.start_date),
    end_date: formatDateApi(plan.end_date),
  };
  const response = await apiClient.post(`${API_BASE_URL}/plans`, newPlan);
  return toSnakeCase(response.data);
};


export const getPlanById = async (id) => {
  const response = await apiClient.get(`${API_BASE_URL}/plans/${id}`);
  return toSnakeCase(response.data);
};


export const updatePlan = async (id, updatedPlan) => {
  const response = await apiClient.patch(`${API_BASE_URL}/plans/${id}`, {
    ...updatedPlan,
    start_date: formatDateApi(updatedPlan.start_date),
    end_date: formatDateApi(updatedPlan.end_date),
  });
  return toSnakeCase(response.data);
};


export const updatePlanWithActivities = async (id, basket) => {
  const response = await apiClient.patch(
    `${API_BASE_URL}/plans/${id}/activities`,
    basket
  );
  return toSnakeCase(response.data);
};


export const updatePlanWithActivitiesCalendar = async (
  id,
  activities_linked
) => {
  const response = await apiClient.patch(
    `${API_BASE_URL}/plans/${id}/activities-calendar`,
    activities_linked
  );
  return toSnakeCase(response.data);
};


export const deletePlan = async (id) => {
  const response = await apiClient.delete(`${API_BASE_URL}/plans/${id}`);
  return toSnakeCase(response.data);
};


export const getAllPublicPlans = async () => {
  const response = await apiClient.get(`${API_BASE_URL}/public`);
  return toSnakeCase(response.data);
};


export const getPublicPlanById = async (id) => {
  const response = await apiClient.get(`${API_BASE_URL}/public/${id}`);
  return toSnakeCase(response.data);
};


export const registerEarlyUser = async (user) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/users/registerEarly`,
      user
    );
    return toSnakeCase(response.data);
  } catch (error) {
    console.log(error);
  }
};


export const loginUser = async (user) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/users/login`, user);
    return toSnakeCase(response);
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
    return toSnakeCase(response);
  } catch (error) {
    throw Error(error.response.data.error);
  }
};


export const refreshTokenUser = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/users/refresh`);
    return toSnakeCase(response);
  } catch (error) {
    throw Error(error.response.data.error);
  }
};


export const updateUser = async (user) => {
  try {
    const response = await apiClient.patch(
      `${API_BASE_URL}/users/${user.user_id}`,
      user
    );
    return toSnakeCase(response);
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
    return toSnakeCase(response);
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
