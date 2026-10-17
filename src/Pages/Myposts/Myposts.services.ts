import axios from "axios";

export async function getUserPostsApi(userId: string) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${userId}/posts`, {
      headers: {
        token: `${localStorage.getItem("user_tkn")}`, 
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}