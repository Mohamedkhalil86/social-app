export interface IFollower {
  _id: string;
  name: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  photo: string;
  cover: string;
  followers: IFollower[];
  following: any[]; 
  createdAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

export interface IProfileResponse {
  success: boolean;
  message: string;
  data: {
    isFollowing: boolean;
    user: IUser;
  };
}

export interface IUploadPhotoResponse {
  success: boolean;
  message: string;
  data: {
    photo: string;
    user: IUser;
    message: string;
  };
}