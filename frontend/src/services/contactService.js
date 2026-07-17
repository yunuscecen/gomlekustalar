import apiClient from "../api/apiClient";

export const sendContactMessage = async (formData) => {
  const response = await apiClient.post("/contact", formData);

  return response.data;
};