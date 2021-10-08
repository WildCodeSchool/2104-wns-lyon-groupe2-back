export interface IUser {
  id: string
  lastname: string
  firstname: string
  avatar: string
  email: string
  password: string
  passwordConfirmation: string
  schoolId: string
  themeId: string
  isSchoolAdmin: Boolean
  userType: string
  workspacesadmin: string[]
  color: string,
  age: string,
  city: string,
  bio: string
}

export interface iTokenDecrypted {
  // eslint-disable-next-line camelcase
  first_connection: boolean
  email: string
  exp: number
  firstname: string
  iat: number
  isSchoolAdmin: boolean
  lastname: string
  schoolId: string
  userId: string
  userType: string
}
