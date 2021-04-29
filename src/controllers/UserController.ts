import UserModel from '../models/UserModel'
import { IUser } from '../interfaces'
import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'
import * as argon2 from 'argon2'
const { ForbiddenError, UserInputError } = require('apollo-server')

const env: IConfig = config

// do no forget parent !!!

const hashPassword = async (password: string) => argon2.hash(password)

const verifyPassword = async (userPassword: any, plainPassword: string) => {
  return argon2.verify(userPassword, plainPassword)
}

export const registerUser = async (parent: any, args: any) => {
  const input: IUser = args.input
  const encrypted_password = await hashPassword(input.password)
  const { password, password_confirmation, ...datasWithoutPassword } = input
  const userToSave = { ...datasWithoutPassword, encrypted_password }
  await UserModel.init()
  const model = new UserModel(userToSave)
  const result = await model.save()
  return result
}

// J'en ai marre de pas reussir a la typer.....
/* interface Token {
  userId: string
  iat: number
  ExpiresIn: strin
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
  if (!context.user) return null
  console.log(context.user)
  const result = await UserModel.find()
  return result
}

export const deleteUser = async (parent: any, args: any, context: any) => {
  const id: String = args.input.id
  const user = await UserModel.findById(id)
  if (user) {
    const result = await UserModel.deleteOne({ _id: id })
  }
  console.log(user)
  return `User ${user.firstname} ${user.lastname} has been successfully deleted`
}

export const updateUser = async (parent: any, args: any, context: any) => {
  const input: IUser = args.input // values send by client
  const user = await UserModel.findById(input.id) // find corresponding user in DB
  const isPasswordVerified = await verifyPassword(
    user.encrypted_password,
    input.password,
  )
  if (context.user.id !== user.id) {
    throw new ForbiddenError("You're only allowed to update your profile !")
  }
  if (!isPasswordVerified) {
    throw new UserInputError("Your password isn't valid !")
  }
  if (user) {
    user._doc = { ...user._doc, ...input } // update user's datas
    return await user.save() // save datas
  }
}
