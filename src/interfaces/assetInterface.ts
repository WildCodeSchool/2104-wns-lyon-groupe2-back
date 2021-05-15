export interface IAssets {
  id: string
  title: string
  type: string
  folders: [string] /* folder_id */
  userId: string
  createdAt: Date
  lastView: Date
  likes: number
  dislikes: number
  bookmarkedCount: number
  tags: [string] /* tag_id */
  openingCount: number
}
