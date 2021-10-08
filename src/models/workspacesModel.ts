import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const WorkspacesSchema = new Schema({
  schoolId: String,
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
          userName: String,
          color: String,
          createdAt: Date,
          assetId: String,
          likes: [
            {
              userId: String,
              userName: String,
            },
          ],
          dislikes: [
            {
              userId: String,
              userName: String,
            },
          ],
          comments: [
            {
              content: String,
              userId: String,
              userName: String,
              color: String,
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
          folderName: String,
          parentId: String,
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
