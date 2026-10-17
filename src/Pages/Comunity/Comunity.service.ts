import axios from "axios";

export async function getallPosts(page = 1) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts?page=${page}`, {
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