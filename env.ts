// environnement
require('dotenv').config();

const rawOptions = process.env.OPTIONS || '{}';
const options = JSON.parse(rawOptions);
const db = process.env.DB || 'dbDefault';
const serverPort = process.env.SERVER_PORT || '4000';

export interface IConfig {
  db: string;
  options: any;
  serverPort: string;
}

export const config: IConfig = {
  db,
  options,
  serverPort,
};
