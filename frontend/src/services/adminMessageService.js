import apiClient from "../api/apiClient";

const adminWriteConfig = {
  headers: {
    "X-Admin-Request": "1",
  },
};

export const getAdminMessages = async ({
  page = 1,
  limit = 10,
  status = "",
  search = "",
} = {}) => {
  const response = await apiClient.get("/admin/messages", {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
      ...(search ? { search } : {}),
    },
  });

  return response.data;
};

export const getAdminMessageById = async (messageId) => {
  if (!messageId) {
    throw new Error("Mesaj bilgisi bulunamadı.");
  }

  const response = await apiClient.get(
    `/admin/messages/${messageId}`
  );

  return response.data.data;
};

export const updateAdminMessage = async (
  messageId,
  messageData
) => {
  if (!messageId) {
    throw new Error("Güncellenecek mesaj bulunamadı.");
  }

  const response = await apiClient.patch(
    `/admin/messages/${messageId}`,
    messageData,
    adminWriteConfig
  );

  return response.data;
};

export const deleteAdminMessage = async (messageId) => {
  if (!messageId) {
    throw new Error("Silinecek mesaj bulunamadı.");
  }

  const response = await apiClient.delete(
    `/admin/messages/${messageId}`,
    adminWriteConfig
  );

  return response.data;
};