import UserModel from '../models/UserModel'
import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'
import * as argon2 from 'argon2'

const env: IConfig = config

const verifyPassword = async (userPassword: any, plainPassword: string) => {
  return argon2.verify(userPassword, plainPassword)
}

export const Login = async (parent: any, args: any) => {
  const email: string = args.input.email
  const password: string = args.input.password
  const user = await UserModel.findOne({ email: email })
  if (!user) {
    throw new Error('No User Found')
  }
  const isPasswordVerified = await verifyPassword(
    user.encrypted_password,
    password,
  )

  if (!isPasswordVerified) {
    throw new Error('Invalid Credentials')
  }

  const token = jwt.sign({ userId: user.id }, env.jwt_secret)
  const payload = { token: token, email: email }
  return payload
}
