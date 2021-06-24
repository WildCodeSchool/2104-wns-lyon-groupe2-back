export interface IShareAssets {
  id: string
  assetName: string
  folders: IFolders[]
}
export interface IFolders {
  id: string
  folderName: string
  parentId: string
  title: string
  assets: IShareAssets[]
}

export interface IWorkspaces {
  id: string
  schoolId: string
  userAdmin: string
  isSchoolWorkspace: boolean
  usersAllowed: [string] /* user_id */
  title?: string
  feed: [
    {
      id: string
      feedName: string
      messages: [
        {
          id: string
          content: string
          userId: string
          createdAt: Date
          assetId: string
          likes: number
          dislikes: number
          comments: [
            {
              id: string
              content: string
              userId: string
              createdAt: Date
            },
          ]
        },
      ]
    },
  ]
  assets: IShareAssets[]

  visio: string
}
