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
