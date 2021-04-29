export interface IAssets {
  id: string
  title: string
  type: string
  folders: [string] /* folder_id */
  user_id: string
  created_at: Date
  last_view: Date
  likes: number
  dislikes: number
  bookmarked_count: number
  tags: [string] /* tag_id */
  opening_count: number
}
