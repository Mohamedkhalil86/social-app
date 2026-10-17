import axios from "axios";

const getHeaders = () => {
  const token = localStorage.getItem("user_tkn");
  return {
    headers: {
      token: `${token}`,
      Authorization: `Bearer ${token}`,
    },
  };
};


export async function getAllNotificationsApi(page: number = 1, limit: number = 10) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/notifications?page=${page}&limit=${limit}`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    throw error;
  }
}


export async function getUnreadNotificationsApi(page: number = 1, limit: number = 10) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/notifications?unread=false&page=${page}&limit=${limit}`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }
}

export async function getUnreadNotificationsCountApi() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/notifications/unread-count`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
}

export async function markAllNotificationsAsReadApi() {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/notifications/read-all`,
      {},
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all as read:", error);
    throw error;
  }
}

export async function markSingleNotificationAsReadApi(notificationId: string) {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/notifications/${notificationId}/read`,
      {},
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error marking single as read:", error);
    throw error;
  }
}