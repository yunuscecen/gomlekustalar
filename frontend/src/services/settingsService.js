import apiClient from "../api/apiClient";

export const getSiteSettings = async () => {
  const response = await apiClient.get("/settings");

  return response.data.data;
};