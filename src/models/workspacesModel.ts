import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const WorkspacesSchema = new Schema({
  school_Id: String,
  userAdmin: String,
  isSchoolWorkspace: Boolean,
  usersAllowed: [String] /* user_id */,
  title: String,
  feed: [
    {
      feedName: String,
      messages: [
        {
          content: String,
          userId: String,
          createdAt: Date,
          assetId: String,
          likes: Number,
          dislikes: Number,
          comments: [
            {
              content: String,
              userId: String,
              createdAt: Date,
            },
          ],
        },
      ],
    },
  ],
  assets: [
    {
      assetName: String,
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
