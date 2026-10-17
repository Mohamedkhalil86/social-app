import axios from "axios";
import type { IFeedResponse } from "./Homefeed.interface";

export async function getFeedPosts(only: string = "following", limit: number = 10): Promise<IFeedResponse> {
  const token = localStorage.getItem("user_tkn");

  const response = await axios.get<IFeedResponse>(
    `${import.meta.env.VITE_BASE_URL}/posts/feed`,
    {
      params: {
        only,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}








export async function toggleLikeApi(postId: string) {
  try {
    const token = localStorage.getItem("user_tkn");
    console.log(postId)

    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
 
    console.error("API Error Response:", error.response?.data || error.message);
    throw error;
  }
}



const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_tkn")}`,
  },
});


export async function deletePostApi(postId: string) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
    getHeaders()
  );
  return response.data;
}


export async function updatePostApi(postId: string, body: string) {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
    { body },
    getHeaders()
  );
  return response.data;
}


export async function toggleBookmarkApi(postId: string) {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/bookmark`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_tkn")}`,
      },
    }
  );
  
  return response.data;
}


export async function sharePostApi(postId: string, bodyText: string) {
  try {
    const token = localStorage.getItem("user_tkn");

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}/share`,
      { body: bodyText },
      {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Share post response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sharing post:", error);
    throw error;
  }
}



const getHeaderss = () => {
  const token = localStorage.getItem("user_tkn");
  return {
    headers: {
      token: `${token}`,
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function getPostLikesApi(postId: string) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}/likes`,
      getHeaderss()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post likes:", error);
    throw error;
  }
}