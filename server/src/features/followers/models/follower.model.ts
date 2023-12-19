export enum EFollowerStatus {
  'pending' = 'pending',
  'accepted' = 'accepted',
  'rejected' = 'rejected',
}

export interface IFollower {
  _id: string
  follower: string
  followee: string
  status: EFollowerStatus
  updatedAt: string
}
