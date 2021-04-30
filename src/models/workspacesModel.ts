import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const WorkspacesSchema = new Schema({
  school_id: String,
  user_admin: String,
  is_school_workspace: Boolean,
  users_allowed: [String] /* user_id */,
  title: String,
  feed: [
    {
      feed_name: String,
      messages: [
        {
          content: String,
          user_id: String,
          created_at: Date,
          asset_id: String,
          likes: Number,
          dislikes: Number,
          comments: [
            {
              content: String,
              user_id: String,
              created_at: Date,
            },
          ],
        },
      ],
    },
  ],
  assets: [
    {
      asset_name: String,
      folders: [
        {
          folder_name: String,
          parent_id: String,
          title: String,
          assets: [String],
        },
      ],
    },
  ],

  visio: String,
})

const WorkspacesModel: mongoose.Model<any> = mongoose.model(
  'workspaces',
  WorkspacesSchema,
)
export default WorkspacesModel
