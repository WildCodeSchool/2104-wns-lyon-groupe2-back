export interface IUser {
  id: string
  lastname: string
  firstname: string
  avatar: string
  email: string
  password: string
  password_confirmation: string
  school_id: string
  theme_id: string
  is_school_admin: Boolean
  user_type: string
  workspaces_admin: string[]
}