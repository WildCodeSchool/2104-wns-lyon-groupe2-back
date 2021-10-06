export interface IFolders {
  id: string
  userId: string
  createdAt: Date
  name: string
  parentDirectory: string
  isRootDirectory: boolean
  sequence: number
}
