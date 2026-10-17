export interface IPostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface IPost {
  _id: string;
  id?: string;
  body: string;
  image?: string;
  user: IPostUser;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  bookmarked?: boolean;
   sharedPost?: string | null;
  topComment?: string | null;
  likes?: any[];
  privacy?: string;
  [key: string]: any;
}

export interface ISavedPostsResponse {
  success: boolean;
  message: string;
  data?: IPost[];
  bookmarks?: IPost[];
  posts?: IPost[];
}