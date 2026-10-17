import axios from "axios";

export async function getSinglePostApi(postId: string) {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_tkn")}`,
      },
    }
  );
  return response.data;
}