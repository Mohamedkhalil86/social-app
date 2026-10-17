import axios from "axios";
import type { LoginDataType, RegisterDataType } from "./sign.interface";



export async function userLogin(data: LoginDataType) {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signin`, data);
  return response.data;
  
}

export async function userRegister(data: RegisterDataType) {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`, data);
  return response.data;
}