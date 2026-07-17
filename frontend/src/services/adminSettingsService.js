import apiClient from "../api/apiClient";

const adminWriteConfig = {
  headers: {
    "X-Admin-Request": "1",
  },
};

export const getAdminSettings = async () => {
  const response = await apiClient.get("/admin/settings");

  return response.data.data;
};

export const updateAdminSettings = async (
  settingsData
) => {
  const response = await apiClient.put(
    "/admin/settings",
    settingsData,
    adminWriteConfig
  );

  return response.data;
};