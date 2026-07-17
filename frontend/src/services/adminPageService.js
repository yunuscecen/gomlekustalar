import apiClient from "../api/apiClient";

const adminWriteConfig = {
  headers: {
    "X-Admin-Request": "1",
  },
};

export const getAdminPages = async () => {
  const response = await apiClient.get("/admin/pages");

  return response.data.data;
};

export const getAdminPageBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Düzenlenecek sayfa bulunamadı.");
  }

  const response = await apiClient.get(
    `/admin/pages/${slug}`
  );

  return response.data.data;
};

export const updateAdminPage = async (slug, pageData) => {
  if (!slug) {
    throw new Error("Güncellenecek sayfa bulunamadı.");
  }

  const response = await apiClient.put(
    `/admin/pages/${slug}`,
    pageData,
    adminWriteConfig
  );

  return response.data;
};