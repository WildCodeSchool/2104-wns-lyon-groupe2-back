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

export interface Assets {
  id: string
  asset_name: string
  folders: Folders[]
}
export interface Folders {
  id: string
  folder_name: string
  parent_id: string
  title: string
  assets: Assets[]
}

export interface IWorkspaces {
  id: string
  school_id: string
  user_admin: string
  is_school_workspace: boolean
  users_allowed: [string] /* user_id */
  title: string
  feed: [
    {
      id: string
      feed_name: string
      messages: [
        {
          id: string
          content: string
          user_id: string
          created_at: Date
          asset_id: string
          likes: number
          dislikes: number
          comments: [
            {
              id: string
              content: string
              user_id: string
              created_at: Date
            },
          ]
        },
      ]
    },
  ]
  assets: Assets[]

  visio: string
}
