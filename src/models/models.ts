import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  lastname: String,
  firstname: String,
  avatar: String,
  email: { type: String, unique: true },
  password: String,
  school_id: String,
  theme_id: String,
  is_school_admin: Boolean,
  user_type: String,
});

const UserModel: mongoose.Model<any> = mongoose.model('user', UserSchema);
export default UserModel;

  // workspaces_admin:[String]
