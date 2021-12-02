import { config, IConfig } from '../../../env'
import jwt from 'jsonwebtoken'
import { IUser } from '../../interfaces/userInterface'

const env: IConfig = config

export const generateToken = (user: IUser, remember: boolean = false) => {
  const tokenExpire = remember ? env.jwt_expires_remember : env.jwt_expires_base
  const token = jwt.sign(
    {
      userId: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      color: user.color,
      schoolId: user.schoolId,
      themeId: user.themeId,
      isSchoolAdmin: user.isSchoolAdmin,
      userType: user.userType,
      workspacesadmin: user.workspacesadmin,
      first_connection: user.first_connection,
      avatarUrl: user.avatarUrl,
      backgroundUrl: user.backgroundUrl,
    },
    env.jwt_secret,
    {
      expiresIn: tokenExpire,
    },
  )
  const payload = { token: token, email: user.email }
  return payload
}
