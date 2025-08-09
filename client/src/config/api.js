// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const UPLOAD_BASE_URL =
  import.meta.env.VITE_UPLOAD_URL || "http://localhost:5000/uploads";

export const API_ENDPOINTS = {
  FORMS: `${API_BASE_URL}/forms`,
  RESPONSES: `${API_BASE_URL}/responses`,
  IMAGES: `${API_BASE_URL}/images`,
  UPLOAD: `${API_BASE_URL}/images/upload`,
};

export const UPLOAD_URL = UPLOAD_BASE_URL;

export default API_ENDPOINTS;
