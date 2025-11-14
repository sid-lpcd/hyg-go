export interface FormLabel {
  name: string;
  text: string;
  type: "input" | "textarea" | "datetime-local" | "select";
  placeholder?: string;
  options?: string[];
  min?: string;
  max?: string;
}