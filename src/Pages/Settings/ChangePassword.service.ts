import axios from "axios";
import type { IChangePasswordPayload } from "./ChangePassword.interface";

const getHeaders = () => {
  const token = localStorage.getItem("user_tkn");
  return {
    headers: {
      "Content-Type": "application/json",
      token: `${token}`,
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function changePasswordApi(payload: IChangePasswordPayload) {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/users/change-password`,
      payload,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}