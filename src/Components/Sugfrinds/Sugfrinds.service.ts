import axios from "axios";

export async function getSuggestedFriends(limit = 5, page = 1) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/suggestions?limit=${limit}&page=${page}`, {
      headers: {
        token: `${localStorage.getItem("user_tkn")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested friends:", error);
    throw error;
  }
}

export async function toggleFollowUser(userId: string) {
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
    console.error("Error toggling follow:", error);
    throw error;
  }
}