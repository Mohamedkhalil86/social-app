export interface IActor {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
}

export interface IEntity {
  _id?: string;
  body?: string;
  username?: string;
  unavailable?: boolean;
}

export interface INotification {
  _id: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actor?: IActor;
  entityType?: string;
  entityId?: string;
  entity?: IEntity;
  content?: string;
}