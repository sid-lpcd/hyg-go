import axios, { AxiosResponse, AxiosError, AxiosInstance } from "axios";
import { formatDateApi } from "./dateFormat";
import { getToken } from "./tokenHelper";
import { ModelMappers } from "./modelMappers";
import {
  // Request types
  CreateActivityRequest,
  UpdateActivityRequest,
  CreateLocationRequest,
  UpdateLocationRequest,
  CreatePlanRequest,
  UpdatePlanRequest,
  RegisterEarlyUserRequest,
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UpdatePlanActivityRequest,
  
  // Response types
  Activity,
  Location,
  Plan,
  User,
  AuthToken,
  ApiError,
  
  // Common types
  BoundingBox,
  PassGenerationResponse,
} from "../types/contract";
import { AuthUser, Pass, PlanWithActivities } from "../types/common";

const API_BASE_URL =
  import.meta.env.VITE_ENV_TYPE === "DEV"
    ? import.meta.env.VITE_HYGGO_API_URL
    : import.meta.env.VITE_HYGGO_API_URL_PRODUCTION;

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Add error handling interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        error: (error.response.data as any)?.error || 'API Error',
        message: (error.response.data as any)?.message || error.message,
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
    const response: any = await apiClient.get(
      `/activities${
        bounds ? `?swLat=${bounds.swLat}&neLat=${bounds.neLat}&swLng=${bounds.swLng}&neLng=${bounds.neLng}` : ""
      }`
    );
    return ModelMappers.mapActivities(response) as Activity[];
  } catch (error) {
    throw error as ApiError;
  }
};

export const addActivity = async (activity: CreateActivityRequest): Promise<Activity> => {
  try {
    const response: any = await apiClient.post(`/activities`, activity);
    return ModelMappers.mapActivity(response) as Activity;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getActivityById = async (id: number): Promise<Activity> => {
  try {
    const response: any = await apiClient.get(`/activities/${id}`);
    return ModelMappers.mapActivity(response) as Activity;
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateActivity = async (id: number, updatedActivity: UpdateActivityRequest): Promise<Activity> => {
  try {
    const response: any = await apiClient.patch(
      `/activities/${id}`,
      updatedActivity
    );
    return ModelMappers.mapActivity(response) as Activity;
  } catch (error) {
    throw error as ApiError;
  }
};

export const deleteActivity = async (id: number): Promise<{ success: boolean }> => {
  try {
    await apiClient.delete(`/activities/${id}`);
    return { success: true };
  } catch (error) {
    throw error as ApiError;
  }
};

// Location API functions
export const getAllLocations = async (searchQuery: string = ""): Promise<Location[]> => {
  try {
    const response: any = await apiClient.get(`/locations`, {
      params: { search: searchQuery },
    });
    return ModelMappers.mapLocations(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const addLocation = async (location: CreateLocationRequest): Promise<Location> => {
  try {
    const response: any = await apiClient.post(`/locations`, location);
    return ModelMappers.mapLocation(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const getLocationById = async (id: number): Promise<Location> => {
  try {
    const response: any = await apiClient.get(`/locations/${id}`);
    return ModelMappers.mapLocation(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const getLocationByCoordinates = async (lat: number, lng: number): Promise<Location | null> => {
  if (!lat || !lng) return null;
  try {
    const response: any = await apiClient.get(
      `/locations/coordinates?lat=${lat}&lng=${lng}`
    );
    return ModelMappers.mapLocation(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateLocation = async (id: number, updatedLocation: UpdateLocationRequest): Promise<Location> => {
  try {
    const response: any = await apiClient.patch(
      `/locations/${id}`,
      updatedLocation
    );
    return ModelMappers.mapLocation(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const deleteLocation = async (id: number): Promise<{ success: boolean }> => {
  try {
    await apiClient.delete(`/locations/${id}`);
    return { success: true };
  } catch (error) {
    throw error as ApiError;
  }
};

export const getAllCategoriesForLocation = async (locationId: number): Promise<string[]> => {
  try {
    const response: string[] = await apiClient.get(
      `${API_BASE_URL}/locations/${locationId}/categories`
    );
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getAllActivitiesForLocation = async (
  locationId: number,
  offset: number = 0,
  limit: number = 10
): Promise<Activity[]> => {
  try {
    const response: any = await apiClient.get(
      `${API_BASE_URL}/locations/${locationId}/activities`,
      {
        params: {
          offset: offset,
          limit: limit,
        },
      }
    );
    return ModelMappers.mapActivities(response) as Activity[];
  } catch (error) {
    throw error as ApiError;
  }
};

export const getAllActivitiesForBounds = async (locationId: number, bounds: BoundingBox): Promise<Activity[]> => {
  try {
    const response: any = await apiClient.post(
      `${API_BASE_URL}/locations/${locationId}/activities/bounds`,
      {
        bounds: bounds,
      }
    );
    return ModelMappers.mapActivities(response) as Activity[];
  } catch (error) {
    throw error as ApiError;
  }
};

export const getAllPlansForLocation = async (locationId: number): Promise<Plan[]> => {
  try {
    const response: any = await apiClient.get(
      `${API_BASE_URL}/locations/${locationId}/plans`
    );
    return ModelMappers.mapPlans(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const createAIPlan = async (planId: number): Promise<Plan | PlanWithActivities> => {
  try {
    const response: any = await apiClient.post(
      `${API_BASE_URL}/plans/${planId}/AI-plan`
    );
    return ModelMappers.mapPlan(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const getAllActivitiesForCategoryForLocation = async (
  locationId: number,
  category: string
): Promise<Activity[]> => {
  try {
    const response: any = await apiClient.get(
      `${API_BASE_URL}/locations/${locationId}/categories/${category}/activities`
    );
    return ModelMappers.mapActivities(response) as Activity[];
  } catch (error) {
    throw error as ApiError;
  }
};

// Plan API functions
export const getAllPlans = async (): Promise<Plan[]> => {
  try {
    const response: any = await apiClient.get(`${API_BASE_URL}/plans`);
    return ModelMappers.mapPlans(response);
  } catch (error) {
    throw error;
  }
};

export const getAllPlansForUser = async (after?: string, before?: string): Promise<Plan[]> => {
  try {
    const response: any = await apiClient.get(`${API_BASE_URL}/plans/user`, {
      params: { after, before }
    });
    return ModelMappers.mapPlans(response);
  } catch (error) {
    throw error;
  }
};

export const addPlan = async (plan: CreatePlanRequest): Promise<Plan> => {
  try {
    const newPlan = {
      ...plan,
      startDate: formatDateApi(plan.startDate),
      endDate: formatDateApi(plan.endDate),
    };
    const response: any = await apiClient.post(`${API_BASE_URL}/plans`, newPlan);
    return ModelMappers.mapPlan(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const getPlanById = async (id: number): Promise<Plan> => {
  try {
    const response: any = await apiClient.get(`${API_BASE_URL}/plans/${id}`);
    return ModelMappers.mapPlan(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const updatePlan = async (id: number, updatedPlan: UpdatePlanRequest): Promise<Plan> => {
  try {
    //TODO: Request should be prepared on helper
    const response: any = await apiClient.patch(`${API_BASE_URL}/plans/${id}`, {
      ...updatedPlan,
      ...(updatedPlan.startDate && { startDate: formatDateApi(updatedPlan.startDate) }),
      ...(updatedPlan.endDate && { endDate: formatDateApi(updatedPlan.endDate) }),
    });
    return ModelMappers.mapPlan(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const updatePlanWithActivities = async (id: number, activities: UpdatePlanActivityRequest[]): Promise<Plan> => {
  try {
    const response: any = await apiClient.patch(
      `${API_BASE_URL}/plans/${id}/activities`,
      activities
    );
    return ModelMappers.mapPlan(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const deletePlan = async (id: number): Promise<{ success: boolean }> => {
  try {
    await apiClient.delete(`${API_BASE_URL}/plans/${id}`);
    return { success: true };
  } catch (error) {
    throw error as ApiError;
  }
};

// Public API functions
export const getAllPublicPlans = async (): Promise<Plan[]> => {
  try {
    const response: any = await apiClient.get(`${API_BASE_URL}/public`);
    return ModelMappers.mapPlans(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const getPublicPlanById = async (id: number): Promise<Plan> => {
  try {
    const response: any = await apiClient.get(`${API_BASE_URL}/public/${id}`);
    return ModelMappers.mapPlan(response);
  } catch (error) {
    throw error as ApiError;
  }
};

// Temporary
export const registerEarlyUser = async (user: RegisterEarlyUserRequest): Promise<{ success: boolean; message: string } | undefined> => {
  try {
    await apiClient.post(
      `${API_BASE_URL}/users/registerEarly`,
      user
    );
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (user: LoginUserRequest): Promise<AuthUser> => {
  try {
    const response: any = await apiClient.post(`/users/login`, user);
    return ModelMappers.mapAuthResponse(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const registerUser = async (user: RegisterUserRequest): Promise<AuthUser> => {
  try {
    const response: any = await apiClient.post(
      `/users/register`,
      user
    );
    return ModelMappers.mapAuthResponse(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const refreshTokenUser = async (): Promise<AuthToken> => {
  try {
    const response: any = await apiClient.get(`/users/refresh`);
    return ModelMappers.mapAuthResponse(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateUser = async (user: UpdateUserRequest): Promise<User> => {
  try {
    const response: any = await apiClient.patch(
      `/users/${user.userId}`,
      user
    );
    return ModelMappers.mapUser(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const getUserProfile = async (authToken: string): Promise<User> => {
  try {
    const response: any = await apiClient.get(`/users/profile`, {
      headers: {
        authorisation: `Bearer ${authToken}`,
      },
    });
    return ModelMappers.mapUser(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const generatePass = async (planId: number): Promise<PassGenerationResponse> => {
  try {
    const response = await apiClient.post(`/passes/${planId}`);
    return ModelMappers.mapPassGeneration(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const getAllPasses = async (): Promise<Pass[]> => {
  try {
    const response = await apiClient.get(`/passes`);
    if (!Array.isArray(response)) return [];
    return response?.map(pass => ModelMappers.mapPass(pass)) || [];
  } catch (error) {
    throw error as ApiError;
  }
};

export const getPassQRCode = async (passId: string): Promise<PassGenerationResponse> => {
  try {
    const response = await apiClient.get(`/passes/${passId}/qr-code`);
    return ModelMappers.mapPassGeneration(response);
  } catch (error) {
    throw error as ApiError;
  }
};