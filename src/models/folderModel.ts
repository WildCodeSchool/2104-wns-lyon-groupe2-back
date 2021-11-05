import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const FoldersSchema = new Schema({
  userId: String,
  createdAt: { type: Date, default: Date.now },
  sequence: Number,
  name: String,
  parentDirectory: String,
})

const FoldersModel: mongoose.Model<any> = mongoose.model(
  'folders',
  FoldersSchema,
)
export default FoldersModel
