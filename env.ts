// environnement
require('dotenv').config()

const rawOptions = process.env.OPTIONS || '{}'
const options = JSON.parse(rawOptions)
const db = process.env.DB || 'dbDefault'
const serverPort = process.env.SERVER_PORT || '4000'
const jwt_secret = process.env.JWT_SECRET || ''

export interface IConfig {
  db: string
  options: any
  serverPort: string
  jwt_secret: string
}

export const config: IConfig = {
  db,
  options,
  serverPort,
  jwt_secret,
}
