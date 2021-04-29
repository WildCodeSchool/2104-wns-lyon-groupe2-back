import UserModel from '../models/models'
import { IUser } from '../interfaces/userInterface'

// do no forget parent !!!

export const createUser = async (parent: any, args: any) => {
  const input: IUser = args.input
  await UserModel.init()
  const model = new UserModel(input)
  const result = await model.save()
  return result
}

export const allUsers = async () => {
  const result = await UserModel.find()
  console.log(result)
  return result
}

export const deleteUser = async (parent: any, args: any) => {
  const id: String = args.input.id
  const user = await UserModel.findById(id)
  if (user) {
    const result = await UserModel.deleteOne({ _id: id })
  }
  console.log(user)
  return `User ${user.firstname} ${user.lastname} has been successfully deleted`
}

export const updateUser = async (parent: any, args: any) => {
  const input: IUser = args.input // values send by client
  const user = await UserModel.findById(input.id) // find corresponding user in DB
  if (user) {
    user._doc = { ...user._doc, ...input } // update user's datas
    return await user.save() // save datas
  }
}
