export interface LoginDataType {
  email: string;
  password: string;
}

export interface RegisterDataType {
  name: string;
  username?: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  rePassword: string;
}