import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const FoldersSchema = new Schema({
  userId: String,
  createdAt: Date,
  name: String,
  children: [String],
  isRootDirectory: Boolean,
})

const FoldersModel: mongoose.Model<any> = mongoose.model(
  'folders',
  FoldersSchema,
)
export default FoldersModel
