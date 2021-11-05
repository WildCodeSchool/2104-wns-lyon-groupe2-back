import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const SchoolSchema = new Schema({
  schoolName: String,
  logo: String,
  firstname: String,
  lastname: String,
  email: String,
  primaryColor: String,
  secondaryColor: String,
})

const SchoolModel: mongoose.Model<any> = mongoose.model('schools', SchoolSchema)
export default SchoolModel
