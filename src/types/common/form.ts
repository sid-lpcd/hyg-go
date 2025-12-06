import { Plan } from './plan';

export interface FormLabel {
  name: string;
  text: string;
  type: "input" | "textarea" | "datetime-local" | "select";
  placeholder?: string;
  options?: string[];
  min?: string;
  max?: string;
}

// TripData interface for form handling - based on Plan but with form-specific types
export interface TripData extends Pick<Plan, 'title' | 'description' | 'people'> {
  planId?: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  locationId: number | null; 
}

export interface CreatePlanFormData extends Pick<Plan, 'title' | 'description'> {
  update?: boolean;
}

export interface AddActivityFormData {
  activity: string;
  start_date: string;
}