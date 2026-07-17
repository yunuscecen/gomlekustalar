import apiClient from "../api/apiClient";

export const getPageBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Sayfa bilgisi bulunamadı.");
  }

  const response = await apiClient.get(`/pages/${slug}`);

  return response.data.data;
};

export const getPublishedPages = async () => {
  const response = await apiClient.get("/pages");   

  return response.data.data;
};