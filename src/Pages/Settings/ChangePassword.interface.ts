export interface IChangePasswordPayload {
  password: string;
  newPassword: string;
}

export interface IChangePasswordResponse {
  success?: boolean;
  message?: string;
  token?: string;
}