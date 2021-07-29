import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const AssetsSchema = new Schema({
  title: String,
  type: String,
  folders: [String],
  userId: String,
  createdAt: Date,
  lastView: Date,
  likes: Number,
  dislikes: Number,
  bookmarkedCount: Number,
  tags: [String],
  openingCount: Number,
})

const WorkspacesModel: mongoose.Model<any> = mongoose.model(
  'assets',
  AssetsSchema,
)
export default WorkspacesModel
