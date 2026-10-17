import axios from "axios";

const getHeaders = (isMultipart = false) => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_tkn")}`,
    ...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
  },
});

export async function getPostComments(postId: string, page = 1, limit = 10) {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`,
    getHeaders()
  );
  return response.data;
}


export async function createComment(postId: string, content: string, image?: File) {
  const formData = new FormData();
  if (content) formData.append("content", content);
  if (image) formData.append("image", image);

  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`,
    formData,
    getHeaders(true)
  );
  return response.data;
}

export async function updateComment(postId: string, commentId: string, content: string) {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
    { content },
    getHeaders()
  );
  return response.data;
}

export async function deleteComment(postId: string, commentId: string) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
    getHeaders()
  );
  return response.data;
}

export async function toggleCommentLike(postId: string, commentId: string) {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/like`,
    {},
    getHeaders()
  );
  return response.data;
}

export async function getCommentReplies(postId: string, commentId: string, page = 1, limit = 10) {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/replies?page=${page}&limit=${limit}`,
    getHeaders()
  );
  return response.data;
}


export async function createReply(postId: string, commentId: string, content: string, image?: File) {
  const formData = new FormData();
  if (content) formData.append("content", content);
  if (image) formData.append("image", image);

  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
    formData,
    getHeaders(true)
  );
  return response.data;
}


