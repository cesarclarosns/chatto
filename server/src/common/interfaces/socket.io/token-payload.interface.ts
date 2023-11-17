export interface ITokenPayloadUser {
  _id: string
  username: string
  profilePicture?: string
  displayName?: string
}

export interface ITokenPayload {
  user: ITokenPayloadUser
}
