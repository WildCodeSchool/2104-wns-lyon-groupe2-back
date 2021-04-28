import UserModel from '../models/models'
import { IUser } from '../interfaces'

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

export const deleteUser = async (parent: any, args: IUser) => {
  const user = await UserModel.findById(args.id)
  if (user) {
    const result = await UserModel.deleteOne({ _id: args.id })
  }
  return `User ${args.id} has been successfully deleted`
}
