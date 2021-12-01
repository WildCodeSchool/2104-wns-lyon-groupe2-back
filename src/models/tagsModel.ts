import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const TagsSchema = new Schema({
  label: String,
})

TagsSchema.index(
  {
    title: 'text',
  },
  {
    default_language: 'fr',
    name: 'tag autocomplete',
  },
)
const WorkspacesModel: mongoose.Model<any> = mongoose.model('tags', TagsSchema)
export default WorkspacesModel
