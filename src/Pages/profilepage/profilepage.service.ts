import axios from "axios";
import { type IProfileResponse, type IUploadPhotoResponse } from "./Profilepage.interface";

export async function getUserProfile(userId: string): Promise<IProfileResponse> {
  try {
    const token = localStorage.getItem("user_tkn");
    const response = await axios.get<IProfileResponse>(
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

export async function uploadProfilePhoto(file: File): Promise<IUploadPhotoResponse> {
  try {
    const token = localStorage.getItem("user_tkn");
    const formData = new FormData();
    formData.append("photo", file);

    const response = await axios.put<IUploadPhotoResponse>(
      `${import.meta.env.VITE_BASE_URL}/users/upload-photo`,
      formData,
      {
        headers: {
          token: `${token}`,
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
}