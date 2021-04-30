import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const AssetsSchema = new Schema({
  title: String,
  type: String,
  folders: [String],
  user_id: String,
  created_at: Date,
  last_view: Date,
  likes: Number,
  dislikes: Number,
  bookmarked_count: Number,
  tags: [String],
  opening_count: Number,
})

const WorkspacesModel: mongoose.Model<any> = mongoose.model(
  'assets',
  AssetsSchema,
)
export default WorkspacesModel
