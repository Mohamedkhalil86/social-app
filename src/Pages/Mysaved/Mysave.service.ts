import axios from "axios";

export async function getSavedPosts() {
  try {
    const token = localStorage.getItem("user_tkn");
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/bookmarks`,
      {
        headers: {
          token: `${token}`,
          Authorization: `Bearer ${token}`,
        },
      }
    );

   
    return response.data?.data?.bookmarks || [];
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw error;
  }
}