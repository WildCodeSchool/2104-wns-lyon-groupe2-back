import UserModel from '../models/userModel'
import { IUser } from '../interfaces/userInterface'
import {sendEmailToNewCustomer} from "../shared/tools/sendEmail"
import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'
import * as argon2 from 'argon2'
const { ForbiddenError, UserInputError } = require('apollo-server')
const env: IConfig = config
import { userValidationSchema } from './joiSchema'
import Joi from 'joi'

// do not forget parent !!!

const hashPassword = async (password: string) => argon2.hash(password)

const verifyPassword = async (userPassword: any, plainPassword: string) => {
  return argon2.verify(userPassword, plainPassword)
}

export const registerUser = async (parent: any, args: any) => {
  try {
    await userValidationSchema.validateAsync(args.input)
  } catch (err) {
    throw new UserInputError(err)
  }
  const input: IUser = args.input
  // TODO : switch 12345678 by a generated password (ex UUID)
  const password = '12345678'
  const encryptedPassword = await hashPassword(password)
  // const { password, passwordConfirmation, ...datasWithoutPassword } = input
  const userToSave = { ...input, encryptedPassword }
  await UserModel.init()
  const model = new UserModel(userToSave)
  const result = await model.save()
  sendEmailToNewCustomer({...input, password})
  return result
}

interface Token {
  userId: string
  iat: number
}
// A voir pour le type assertions ligne 37 "as Token" bonne pratique ?
export const getOneUser = async (token: string) => {
  const tokenDecrypted: Token = jwt.verify(token, env.jwt_secret) as Token
  const user = await UserModel.findById(tokenDecrypted.userId)
  if (!user) {
    throw new Error('User Not Found')
  }
  return user
}

export const allUsers = async (parents: any, arg: any, context: any) => {
  if (!context.user) return null
  const result = await UserModel.find()
  return result
}

export const deleteUser = async (parent: any, args: any, context: any) => {
  const id: String = args.input.id
  const user = await UserModel.findById(id)
  if (user) {
    const result = await UserModel.deleteOne({ _id: id })
  }
  return `User ${user.firstname} ${user.lastname} has been successfully deleted`
}

export const updateUser = async (parent: any, args: any, context: any) => {
  const input: IUser = args.input // values send by client
  const user = await UserModel.findById(input.id) // find corresponding user in DB
  const isPasswordVerified = await verifyPassword(
    user.encryptedPassword,
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
