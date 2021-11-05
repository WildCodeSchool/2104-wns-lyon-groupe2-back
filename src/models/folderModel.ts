import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const FoldersSchema = new Schema({
  userId: String,
  createdAt: { type: Date, default: Date.now },
  sequence: Number,
  name: String,
  parentDirectory: String,
})

// Création des indexs de la table (si non existants) au moment de la création du Model
FoldersSchema.index(
  {
    name: 'text',
  },
  {
    weights: {
      name: 25,
    },
    default_language: 'fr',
    name: 'search with weight',
  },
)

const FoldersModel: mongoose.Model<any> = mongoose.model(
  'folders',
  FoldersSchema,
)
export default FoldersModel
