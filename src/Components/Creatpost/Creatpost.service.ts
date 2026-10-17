import axios from "axios";

export async function createPost(formData: FormData) {
  const token = localStorage.getItem("user_tkn");

  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts`,
    formData,
    {
      headers: {
        token: token, 
      },
    }
  );

  return response.data;
}