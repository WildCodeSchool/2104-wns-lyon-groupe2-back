import UserModel from '../models/userModel'
import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'
import * as argon2 from 'argon2'
import jwtDecode from 'jwt-decode'
import { iTokenDecrypted } from '../interfaces/userInterface'
import { generateToken } from '../shared/tools/token'
const env: IConfig = config

const verifyPassword = async (userPassword: any, plainPassword: string) => {
  return argon2.verify(userPassword, plainPassword)
}

export const Login = async (parent: any, args: any) => {
  const email: string = args.input.email
  const password: string = args.input.password
  const remember: boolean = args.input.remember
  const user = await UserModel.findOne({ email: email })
  if (!user) {
    throw new Error('Invalid Credentials')
  }
  const isPasswordVerified = await verifyPassword(
    user.encryptedPassword,
    password,
  )

  if (!isPasswordVerified) {
    throw new Error('Invalid Credentials')
  }

  return generateToken(user, remember)
}

export const isAuth = async (parent: any, args: any, context: any) => {
  const {
    input: { token },
  } = args
  if (!token) return { auth: false, message: 'Token Absent' }

  const now = Date.now()
  const decoded: iTokenDecrypted = jwtDecode(token)

  if (now > decoded.exp * 1000) return { auth: false, message: 'Token expiré' }

  return { auth: true, message: 'Willkommen' }
}
