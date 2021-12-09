// environnement
require('dotenv').config()

const rawOptions = process.env.OPTIONS || '{}'
const options = JSON.parse(rawOptions)
const db = process.env.DB || 'dbDefault'
const serverPort = process.env.SERVER_PORT || '4000'
const jwt_secret = process.env.JWT_SECRET || ''
const jwt_expires_base = process.env.JWT_EXPIRES_BASE || ''
const jwt_expires_remember = process.env.JWT_EXPIRES_REMEMBER || ''
const sendInBlueApiKey = process.env.SENDINBLUE_API_KEY || ''
const serverPortTest = process.env.SERVER_PORT_TEST
const tokenForTest = process.env.TOKEN_FOR_TEST
export interface IConfig {
  db: string
  options: any
  serverPort: string
  serverPortTest: string
  jwt_secret: string
  jwt_expires_base: string
  jwt_expires_remember: string
  tokenForTest: string
}

export const config: IConfig = {
  db,
  options,
  serverPort,
  serverPortTest,
  jwt_secret,
  jwt_expires_base,
  jwt_expires_remember,
  tokenForTest,
}
