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

// Création des indexs de la table (si non existants) au moment de la création du Model
AssetsSchema.index(
  {
    title: 'text',
    type: 'text',
    tags: 'text',
  },
  {
    weights: {
      title: 25,
      type: 20,
      tags: 20,
    },
    default_language: 'fr',
    name: 'search with weight',
  },
)

const WorkspacesModel: mongoose.Model<any> = mongoose.model(
  'assets',
  AssetsSchema,
)
export default WorkspacesModel
