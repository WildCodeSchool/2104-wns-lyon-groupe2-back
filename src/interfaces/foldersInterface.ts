export interface IFolders {
  id: string
  userId: string
  createdAt: Date
  name: string
  children: [string]
  isRootDirectory: boolean
}
