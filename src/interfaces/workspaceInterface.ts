export interface Share_Assets {
  id: string
  asset_name: string
  folders: Folders[]
}
export interface Folders {
  id: string
  folder_name: string
  parent_id: string
  title: string
  assets: Share_Assets[]
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
  assets: Share_Assets[]

  visio: string
}
