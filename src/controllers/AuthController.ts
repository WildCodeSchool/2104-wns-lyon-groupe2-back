import UserModel from '../models/userModel'
import jwt from 'jsonwebtoken'
import { config, IConfig } from '../../env'
import * as argon2 from 'argon2'
import jwtDecode from 'jwt-decode'
import { iTokenDecrypted } from '../interfaces/userInterface'
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
    throw new Error('No User Found')
  }
  const isPasswordVerified = await verifyPassword(
    user.encryptedPassword,
    password,
  )

  if (!isPasswordVerified) {
    throw new Error('Invalid Credentials')
  }

  // Définition de la durée du token en fonction du remember depuis le formulaire
  const tokenExpire = remember ? env.jwt_expires_remember : env.jwt_expires_base
  // Crération du token
  const token = jwt.sign(
    {
      userId: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      avatar: user.string,
      email: user.email,
      schoolId: user.schoolId,
      themeId: user.themeId,
      isSchoolAdmin: user.isSchoolAdmin,
      userType: user.userType,
      workspacesadmin: user.workspacesadmin,
      first_connection: user.first_connection,
    },
    env.jwt_secret,
    {
      expiresIn: tokenExpire,
    },
  )
  const payload = { token: token, email: email }
  return payload
}

export const isAuth = async (parent: any, args: any, context: any) => {
  const {
    input: { token },
  } = args

  const now = Date.now()
  const decoded: iTokenDecrypted = jwtDecode(token)

  if (now > decoded.exp * 1000) return { auth: false, message: 'Token expiré' }

  return { auth: true, message: 'Willkommen' }
}
