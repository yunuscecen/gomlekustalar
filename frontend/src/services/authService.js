import apiClient from "../api/apiClient";

const adminWriteConfig = {
  headers: {
    "X-Admin-Request": "1",
  },
};

export const loginAdmin = async (credentials) => {
  const response = await apiClient.post(
    "/auth/login",
    credentials
  );

  return response.data.data.admin;
};

export const getCurrentAdmin = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data.data.admin;
};

export const logoutAdmin = async () => {
  const response = await apiClient.post(
    "/auth/logout",
    {},
    adminWriteConfig
  );

  return response.data;
};

export const changeAdminPassword = async (passwordData) => {
  const response = await apiClient.patch(
    "/auth/password",
    passwordData,
    adminWriteConfig
  );

  return response.data;
};