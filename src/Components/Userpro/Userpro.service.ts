import axios from "axios";
import type { IUserProfileResponse } from "./Userpro.interface";

export async function getUserProfileApi(userId: string): Promise<IUserProfileResponse> {
  try {
    const token = localStorage.getItem("user_tkn");
    const response = await axios.get<IUserProfileResponse>(
      `${import.meta.env.VITE_BASE_URL}/users/${userId}/profile`,
      {
        headers: {
          token: `${token}`,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function toggleFollowUserApi(userId: string) {
  try {
    const token = localStorage.getItem("user_tkn");
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/users/${userId}/follow`,
      {},
      {
        headers: {
          token: `${token}`,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling follow status:", error);
    throw error;
  }
}


export async function getUserPostsApi(userId: string) {
  try {
    const token = localStorage.getItem("user_tkn");
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/${userId}/posts`,
      {
        headers: {
          token: `${token}`,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}