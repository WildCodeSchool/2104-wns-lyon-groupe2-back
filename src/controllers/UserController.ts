import UserModel from '../models/userModel'
import { IUser } from '../interfaces/userInterface'
import crypto from 'crypto'

import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'
import * as argon2 from 'argon2'
const { ForbiddenError, UserInputError } = require('apollo-server')
const env: IConfig = config
import { userValidationSchema } from './joiSchema'
import { randomBytes } from 'node:crypto'

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
  const encryptedPassword = await hashPassword(input.password)
  const { password, passwordConfirmation, ...datasWithoutPassword } = input
  const userToSave = { ...datasWithoutPassword, encryptedPassword }
  await UserModel.init()
  const model = new UserModel(userToSave)
  const result = await model.save()
  return result
}

interface Token {
  userId: string
  iat: number
}
// A voir pour le type assertions ligne 37 "as Token" bonne pratique ?
export const getOneUser = async (args: any) => {
  const tokenDecrypted: Token = jwt.verify(args.token, env.jwt_secret) as Token
  const user = await UserModel.findById(tokenDecrypted.userId)
  if (!user) {
    throw new Error('User Not Found')
  }
  return user
}
export const getMyPasswordBack = async (parent: any, args: any) => {
  const user = await UserModel.findOne(args)
  if (!user) {
    throw new Error("Email isn't in the DB")
  }
  const recordedToken = await addTokenForRecovery(user.id)
  const token = recordedToken.reset_password_token
  const url = `http://localhost/3000/${token}`
  //TODO\\ Method d'envoi du mail avec sendingBlue //TODO\\
  return { message: 'Mail Sent', id: user.id }
}

export const allUsers = async (parents: any, arg: any, context: any) => {
  /* if (!context.user) return null */
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

// Je calle ça ici, temporaire, a voir pour middleware.
// Methods pour record un token avec une heure de validité
// (a débattre).

const addTokenForRecovery = async (userId: number) => {
  const token = crypto.randomBytes(20).toString('hex')

  const reset_password_token = token
  const reset_password_expires = Date.now() + 3600

  const user = await UserModel.findById(userId)
  if (!user) {
    throw new Error('User Not Found')
  }
  user._doc = { ...user._doc, reset_password_token, reset_password_expires }
  return await user.save()
}
