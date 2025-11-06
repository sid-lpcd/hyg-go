import axios, { AxiosResponse, AxiosError } from "axios";
import { formatDateApi } from "./dateFormat";
import { getToken } from "./tokenHelper";
import {
  // Request types
  GetActivitiesRequest,
  CreateActivityRequest,
  UpdateActivityRequest,
  GetActivitiesForLocationRequest,
  GetActivitiesForBoundsRequest,
  GetLocationsRequest,
  CreateLocationRequest,
  UpdateLocationRequest,
  GetLocationByCoordinatesRequest,
  CreatePlanRequest,
  UpdatePlanRequest,
  UpdatePlanActivitiesRequest,
  GetPlansForUserRequest,
  RegisterEarlyUserRequest,
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  
  // Response types
  Activity,
  Location,
  Plan,
  User,
  AuthToken,
  ApiError,
  PaginatedResponse,
  
  // Common types
  BoundingBox
} from "../types/contract";

const API_BASE_URL =
  import.meta.env.VITE_ENV_TYPE === "DEV"
    ? import.meta.env.VITE_HYGGO_API_URL
    : import.meta.env.VITE_HYGGO_API_URL_PRODUCTION;

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Add response interceptor to handle data extraction
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        error: error.response.data?.error || 'API Error',
        message: error.response.data?.message || error.message,
        statusCode: error.response.status
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Network error
      const networkError: ApiError = {
        error: 'Network Error',
        message: 'Unable to connect to the server'
      };
      return Promise.reject(networkError);
    } else {
      // Other error
      const genericError: ApiError = {
        error: 'Request Error',
        message: error.message
      };
      return Promise.reject(genericError);
    }
  }
);

// Add an interceptor to include the authorization header
apiClient.interceptors.request.use(
  (config) => {
    const tokenObj = getToken();
    if (tokenObj) {
      config.headers.authorisation = `Bearer ${tokenObj.token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Activity API functions
export const getAllActivities = async (bounds?: BoundingBox): Promise<Activity[]> => {
  try {
    const response: AxiosResponse<Activity[]> = await apiClient.get(
      `/activities${
        bounds ? `?swLat=${bounds.swLat}&neLat=${bounds.neLat}&swLng=${bounds.swLng}&neLng=${bounds.neLng}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const addActivity = async (activity: CreateActivityRequest): Promise<Activity> => {
  try {
    const response: AxiosResponse<Activity> = await apiClient.post(
      `/activities`,
      activity
    );
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getActivityById = async (id: number): Promise<Activity> => {
  try {
    const response: AxiosResponse<Activity> = await apiClient.get(`/activities/${id}`);
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateActivity = async (id: number, updatedActivity: UpdateActivityRequest): Promise<Activity> => {
  try {
    const response: AxiosResponse<Activity> = await apiClient.patch(
      `/activities/${id}`,
      updatedActivity
    );
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const deleteActivity = async (id: number): Promise<{ success: boolean }> => {
  try {
    const response: AxiosResponse<{ success: boolean }> = await apiClient.delete(`/activities/${id}`);
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

// Location API functions
export const getAllLocations = async (searchQuery: string = ""): Promise<Location[]> => {
  try {
    const response: AxiosResponse<Location[]> = await apiClient.get(`/locations`, {
      params: { search: searchQuery },
    });
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const addLocation = async (location: CreateLocationRequest): Promise<Location> => {
  try {
    const response: AxiosResponse<Location> = await apiClient.post(`/locations`, location);
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getLocationById = async (id: number): Promise<Location> => {
  try {
    const response: AxiosResponse<Location> = await apiClient.get(`/locations/${id}`);
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getLocationByCoordinates = async (lat: number, lng: number): Promise<Location | null> => {
  if (!lat || !lng) return null;
  try {
    const response: AxiosResponse<Location> = await apiClient.get(
      `/locations/coordinates?lat=${lat}&lng=${lng}`
    );
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateLocation = async (id: number, updatedLocation: UpdateLocationRequest): Promise<Location> => {
  try {
    const response: AxiosResponse<Location> = await apiClient.patch(
      `/locations/${id}`,
      updatedLocation
    );
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const deleteLocation = async (id: number): Promise<{ success: boolean }> => {
  try {
    const response: AxiosResponse<{ success: boolean }> = await apiClient.delete(`/locations/${id}`);
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getAllCategoriesForLocation = async (locationId: number): Promise<string[]> => {
  const response: AxiosResponse<string[]> = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/categories`
  );
  return response.data;
};

export const getAllActivitiesForLocation = async (
  locationId: number,
  offset: number = 0,
  limit: number = 10
): Promise<PaginatedResponse<Activity>> => {
  const response: AxiosResponse<PaginatedResponse<Activity>> = await apiClient.get(
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

export const getAllActivitiesForBounds = async (locationId: number, bounds: BoundingBox): Promise<Activity[]> => {
  const response: AxiosResponse<Activity[]> = await apiClient.post(
    `${API_BASE_URL}/locations/${locationId}/activities/bounds`,
    {
      bounds: bounds,
    }
  );
  return response.data;
};

export const getAllPlansForLocation = async (locationId: number): Promise<Plan[]> => {
  const response: AxiosResponse<Plan[]> = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/plans`
  );
  return response.data;
};

export const createAIPlan = async (planId: number): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiClient.post(
    `${API_BASE_URL}/plans/${planId}/AI-plan`
  );
  return response.data;
};

export const getAllActivitiesForCategoryForLocation = async (
  locationId: number,
  category: string
): Promise<Activity[]> => {
  const response: AxiosResponse<Activity[]> = await apiClient.get(
    `${API_BASE_URL}/locations/${locationId}/categories/${category}/activities`
  );
  return response.data;
};

// Plan API functions
export const getAllPlans = async (): Promise<Plan[]> => {
  try {
    const response: AxiosResponse<Plan[]> = await apiClient.get(`${API_BASE_URL}/plans`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllPlansForUser = async (after?: string): Promise<PaginatedResponse<Plan>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<Plan>> = await apiClient.get(`${API_BASE_URL}/plans/user`, {
      params: { after: after }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPlan = async (plan: CreatePlanRequest): Promise<Plan> => {
  const newPlan = {
    ...plan,
    startDate: formatDateApi(plan.startDate),
    endDate: formatDateApi(plan.endDate),
  };
  const response: AxiosResponse<Plan> = await apiClient.post(`${API_BASE_URL}/plans`, newPlan);
  return response.data;
};

export const getPlanById = async (id: number): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiClient.get(`${API_BASE_URL}/plans/${id}`);
  return response.data;
};

export const updatePlan = async (id: number, updatedPlan: UpdatePlanRequest): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiClient.patch(`${API_BASE_URL}/plans/${id}`, {
    ...updatedPlan,
    ...(updatedPlan.startDate && { startDate: formatDateApi(updatedPlan.startDate) }),
    ...(updatedPlan.endDate && { endDate: formatDateApi(updatedPlan.endDate) }),
  });
  return response.data;
};

export const updatePlanWithActivities = async (id: number, activities: any[]): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiClient.patch(
    `${API_BASE_URL}/plans/${id}/activities`,
    activities
  );
  return response.data;
};

export const deletePlan = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await apiClient.delete(`${API_BASE_URL}/plans/${id}`);
  return response.data;
};

// Public API functions
export const getAllPublicPlans = async (): Promise<Plan[]> => {
  const response: AxiosResponse<Plan[]> = await apiClient.get(`${API_BASE_URL}/public`);
  return response.data;
};

export const getPublicPlanById = async (id: number): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiClient.get(`${API_BASE_URL}/public/${id}`);
  return response.data;
};

// User API functions
export const registerEarlyUser = async (user: RegisterEarlyUserRequest): Promise<{ success: boolean; message: string } | undefined> => {
  try {
    const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post(
      `${API_BASE_URL}/users/registerEarly`,
      user
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (user: LoginUserRequest): Promise<{ user: User; token: AuthToken }> => {
  try {
    const response: AxiosResponse<{ user: User; token: AuthToken }> = await apiClient.post(`/users/login`, user);
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const registerUser = async (user: RegisterUserRequest): Promise<{ user: User; token: AuthToken }> => {
  try {
    const response: AxiosResponse<{ user: User; token: AuthToken }> = await apiClient.post(
      `/users/register`,
      user
    );
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const refreshTokenUser = async (): Promise<{ token: AuthToken }> => {
  try {
    const response: AxiosResponse<{ token: AuthToken }> = await apiClient.get(`/users/refresh`);
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateUser = async (user: UpdateUserRequest): Promise<{ user: User }> => {
  try {
    const response: AxiosResponse<{ user: User }> = await apiClient.patch(
      `/users/${user.userId}`,
      user
    );
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getUserProfile = async (authToken: string): Promise<{ user: User }> => {
  try {
    const response: AxiosResponse<{ user: User }> = await apiClient.get(`/users/profile`, {
      headers: {
        authorisation: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error as ApiError;
  }
};