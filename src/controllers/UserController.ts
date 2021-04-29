import UserModel from '../models/UserModel'
import { IUser } from '../interfaces'
import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'
import { Interface } from 'node:readline'

const env: IConfig = config

// do no forget parent !!!

export const createUser = async (parent: any, args: any) => {
  const input: IUser = args.input
  await UserModel.init()
  const model = new UserModel(input)
  const result = await model.save()
  return result
}

// J'en ai marre de pas reussir a la typer.....
/* interface Token {
  userId: string
  iat: number
  ExpiresIn: string
} */
// A typer !! le tokenDecrypted
export const getOneUser = async (token: string) => {
  const tokenDecrypted: any = jwt.verify(token, env.jwt_secret)
  const user = await UserModel.findById(tokenDecrypted.userId)
  if (!user) {
    throw new Error('User Not Found')
  }
  return user
}

export const allUsers = async (parents: any, arg: any, context: any) => {
  console.log(context.user)
  const result = await UserModel.find()
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
