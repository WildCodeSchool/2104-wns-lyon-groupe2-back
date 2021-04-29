export interface IUser {
  id: string
  lastname: string
  firstname: string
  avatar: string
  email: string
  password: string
  school_id: string
  theme_id: string
  is_school_admin: boolean
  user_type: string
  workspaces_admin: string[]
}
