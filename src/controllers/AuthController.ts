import UserModel from '../models/UserModel'
import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'

const env: IConfig = config

export const Login = async (parent: any, args: any) => {
  const email: String = args.input.email
  const password: String = args.input.password
  const user = await UserModel.findOne({ email: email })
  if (!user) {
    throw new Error('No User Found')
  }
  if (password !== user.password) {
    throw new Error('Invalid Credentials')
  }
  const token = jwt.sign({ userId: user.id }, env.jwt_secret)
  const payload = { token: token }
  console.log(payload)

  return payload
}
