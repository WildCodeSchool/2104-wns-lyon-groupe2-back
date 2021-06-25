import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  lastname: String,
  firstname: String,
  avatar: String,
  email: { type: String, unique: true },
  encryptedPassword: String,
  schoolId: String,
  themeId: String,
  isSchoolAdmin: Boolean,
  userType: String,
  reset_password_token: String,
  reset_password_expires: Number,
})

const UserModel: mongoose.Model<any> = mongoose.model('user', UserSchema)
export default UserModel

// workspaces_admin:[String]
