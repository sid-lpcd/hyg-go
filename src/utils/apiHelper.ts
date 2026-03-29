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
  CreateUploadIntentBody,
  UploadIntentDTO,
  PlanMediaDTO,
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
import {
  AuthUser,
  Pass,
  PlanView,
  PlanWithActivities,
  PlanWithDetailedActivities,
  PlanWithSummaryActivities,
} from "../types/common";

const API_BASE_URL =
  import.meta.env.VITE_ENV_TYPE === "DEV"
    ? import.meta.env.VITE_HYGGO_API_URL
    : import.meta.env.VITE_HYGGO_API_URL_PRODUCTION;

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

let refreshTokenInFlight: Promise<AuthToken> | null = null;

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
      config.headers.Authorization = `Bearer ${tokenObj.token}`;
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

export const getActivityById = async (id: string): Promise<Activity> => {
  try {
    const response: any = await apiClient.get(`/activities/${id}`);
    return ModelMappers.mapActivity(response) as Activity;
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateActivity = async (id: string, updatedActivity: UpdateActivityRequest): Promise<Activity> => {
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

export const deleteActivity = async (id: string): Promise<{ success: boolean }> => {
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

export const getLocationById = async (id: string): Promise<Location> => {
  try {
    const response: any = await apiClient.get(`/locations/${id}`);
    return ModelMappers.mapLocation(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const getLocationByCoordinates = async (lat: number, lng: number): Promise<Location | null> => {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  try {
    const response: any = await apiClient.get(
      `/locations/coordinates?lat=${lat}&lng=${lng}`
    );
    return ModelMappers.mapLocation(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateLocation = async (id: string, updatedLocation: UpdateLocationRequest): Promise<Location> => {
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

export const deleteLocation = async (id: string): Promise<{ success: boolean }> => {
  try {
    await apiClient.delete(`/locations/${id}`);
    return { success: true };
  } catch (error) {
    throw error as ApiError;
  }
};

export const getAllCategoriesForLocation = async (locationId: string): Promise<string[]> => {
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
  locationId: string,
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

export const getAllActivitiesForBounds = async (locationId: string, bounds: BoundingBox): Promise<Activity[]> => {
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

export const getAllPlansForLocation = async (locationId: string): Promise<Plan[]> => {
  try {
    const response: any = await apiClient.get(
      `${API_BASE_URL}/locations/${locationId}/plans`
    );
    return ModelMappers.mapPlans(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const createAIPlan = async (planId: string): Promise<Plan | PlanWithActivities> => {
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
  locationId: string,
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

export async function getPlanById(id: string, view: "detail"): Promise<PlanWithDetailedActivities>;
export async function getPlanById(id: string, view?: "summary"): Promise<PlanWithSummaryActivities>;
export async function getPlanById(
  id: string,
  view: PlanView = "summary"
): Promise<PlanWithActivities> {
  try {
    const response: any = await apiClient.get(`${API_BASE_URL}/plans/${id}`, {
      params: { view },
    });
    return ModelMappers.mapPlan(response) as PlanWithActivities;
  } catch (error) {
    throw error as ApiError;
  }
}

export const updatePlan = async (id: string, updatedPlan: UpdatePlanRequest): Promise<Plan> => {
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

export const updatePlanWithActivities = async (id: string, activities: UpdatePlanActivityRequest[]): Promise<Plan> => {
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

export const createPlanMediaUploadIntent = async (
  planId: string,
  body: CreateUploadIntentBody
): Promise<UploadIntentDTO> => {
  try {
    const response: UploadIntentDTO = await apiClient.post(`/plans/${planId}/media/upload-intent`, body);
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const uploadPlanMediaFile = async (
  intent: UploadIntentDTO,
  file: File
): Promise<void> => {
  const authToken = getToken()?.token;
  const uploadHeaders: Record<string, string> = { ...intent.upload.headers };

  if (intent.upload.url.includes("/local-upload") && authToken) {
    uploadHeaders.Authorization = `Bearer ${authToken}`;
  }

  const uploadRes = await fetch(intent.upload.url, {
    method: intent.upload.method,
    headers: uploadHeaders,
    body: file,
  });

  if (!uploadRes.ok) {
    if (uploadRes.status === 401 || uploadRes.status === 403) {
      throw new Error(`Upload URL expired while uploading "${file.name}". Please try again.`);
    }
    throw new Error(`Failed to upload "${file.name}".`);
  }
};

export const completePlanMediaUpload = async (
  planId: string,
  mediaId: string
): Promise<PlanMediaDTO> => {
  try {
    const response: PlanMediaDTO = await apiClient.post(`/plans/${planId}/media/${mediaId}/complete`);
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const deletePlan = async (id: string): Promise<{ success: boolean }> => {
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

export const getPublicPlanById = async (id: string): Promise<Plan> => {
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
  if (refreshTokenInFlight) {
    return refreshTokenInFlight;
  }

  refreshTokenInFlight = (async () => {
    try {
      const response: any = await apiClient.get(`/users/refresh`);
      return ModelMappers.mapAuthResponse(response);
    } catch (error) {
      throw error as ApiError;
    } finally {
      refreshTokenInFlight = null;
    }
  })();

  return refreshTokenInFlight;
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
        Authorization: `Bearer ${authToken}`,
      },
    });
    return ModelMappers.mapUser(response);
  } catch (error) {
    throw error as ApiError;
  }
};

export const generatePass = async (planId: string): Promise<PassGenerationResponse> => {
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
