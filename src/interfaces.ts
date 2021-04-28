export interface IUser {
  input: {
    id: string;
    lastname: string;
    firstname: string;
    avatar: string;
    email: string;
    password: string;
    school_id: string;
    theme_id: string;
    is_school_admin: Boolean;
    user_type: string;
    workspaces_admin: string[];
  };
}
