export interface IUser {
  _id: string;
  id?: string;
  name: string;
  photo: string;
  username?: string;
}

export interface IPost {
  id: string;
  _id: string;
  body: string;
  image?: string;
  bookmarked: boolean;
  commentsCount: number;
  createdAt: string;
  likes: any[];
  likesCount: number;
  privacy: string;
  sharedPost: any;
  sharesCount: number;
  topComment: any;
  user: IUser;
}


export interface IFeedResponse {
  message?: string;
  data: {
    posts: IPost[];
  };
}

export interface ILikeUser {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
}