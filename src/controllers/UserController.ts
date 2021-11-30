import UserModel from '../models/userModel'
import { IUser } from '../interfaces/userInterface'

import crypto from 'crypto'

import {
  sendEmailToNewUser,
  mailForPaswwordRecovery,
} from '../shared/tools/sendEmail'

import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'
import * as argon2 from 'argon2'
const { ForbiddenError, UserInputError } = require('apollo-server')
const env: IConfig = config
import { userValidationSchema } from './joiSchema'

// do not forget parent !!!

const hashPassword = async (password: string) => argon2.hash(password)

const verifyPassword = async (userPassword: any, plainPassword: string) => {
  return argon2.verify(userPassword, plainPassword)
}

export const registerUser = async (parent: any, args: any) => {
  await userValidationSchema.validateAsync(args.input)
  const input: IUser = args.input
  // TODO : switch 12345678 by a generated password (ex UUID)
  const password = '12345678'
  const encryptedPassword = await hashPassword(password)
  const token = crypto.randomBytes(20).toString('hex')
  const reset_password_token = token
  const reset_password_expires = Date.now() + 3600
  const first_connection = false
  const color =
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  const city = ''
  const bio = ''
  const age = null
  const userToSave = {
    ...input,
    color,
    city,
    age,
    bio,
    encryptedPassword,
    reset_password_token,
    first_connection: true,
    reset_password_expires: reset_password_expires.toString(),
  }
  await UserModel.init()
  const model = new UserModel(userToSave)
  const result = await model.save()
  const url = `http://localhost:3000/password_management/${token}/${result._id}`

  try {
    sendEmailToNewUser({ ...input, password, url })
  } catch (err) {
    console.log(err)
  }
  return result
}

interface Token {
  userId: string
  iat: number
}
// A voir pour le type assertions ligne 37 "as Token" bonne pratique ?
export const getOneUser = async (args: any) => {
  const tokenDecrypted: Token = jwt.verify(args, env.jwt_secret) as Token
  const user = await UserModel.findById(tokenDecrypted.userId)
  if (!user) {
    throw new Error('User Not Found')
  }
  return user
}

export const allUsers = async (parents: any, arg: any, context: any) => {
  /* if (!context.user) return null */
  const result = await UserModel.find()
  return result
}
export const allUsersWithSchoolId = async (userSchoolId: string) => {
  /* if (!context.user) return null */
  const result = await UserModel.find({ schoolId: userSchoolId }, '_id')
  return result
}

export const getUserByID = async (parent: any, args: any) => {
  const id: String = args.input.id
  const user = await UserModel.findById(id)
  return user
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

  let user = await UserModel.findById(userId)
  if (!user) {
    throw new Error('User Not Found')
  }
  user.reset_password_token = reset_password_token
  user.reset_password_expires = reset_password_expires.toString()
  const updateUserWithToken = await user.save()
  return updateUserWithToken
}

export const getMyPasswordBack = async (parent: any, args: any) => {
  const user = await UserModel.findOne(args)
  if (!user) {
    throw new Error("Email isn't in the DB")
  }
  const recordedToken = await addTokenForRecovery(user.id)
  const token = recordedToken.reset_password_token
  const url = `http://localhost:3000/password_management/${token}/${user.id}`
  const userData = { firstname: user.firstname, url, email: user.email }
  mailForPaswwordRecovery(userData)
  //TODO\\ Method d'envoi du mail avec sendingBlue //TODO\\
  return { message: 'Mail Sent', id: user.id }
}

export const checkTokenWithUserId = async (parent: any, args: any) => {
  const {
    input: { token },
  } = args
  const {
    input: { userId },
  } = args
  const user = await UserModel.find({
    reset_password_token: token,
    _id: userId,
  })

  const time = user[0].reset_password_expires
  const now = Date.now()
  if (time < now) {
    return 'Token Expired'
  }
  if (!user.length) {
    return 'User Not Found'
  }

  return 'Mail Sent'
}

export const updatePassword = async (parent: any, args: any) => {
  const _id = args.inputToChangePassword.userId
  const encryptedPassword = await argon2.hash(
    args.inputToChangePassword.password,
  )
  const first_connection = args.inputToChangePassword.first_connection

  const user = await UserModel.updateOne(
    { _id: _id },
    { encryptedPassword: encryptedPassword },
    { new: true },
  )
  const turnOffFirstConnection = await UserModel.updateOne(
    { _id: _id },
    { first_connection: first_connection },
    { new: true },
  )
  return { message: 'updated' }
}
