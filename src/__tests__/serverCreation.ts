import { ApolloServer } from 'apollo-server-express'
import { schema } from '../schemasResolvers/schema'
import mongoose from 'mongoose'

import { GET_ALL_TAGS } from './query'
import { config, IConfig } from '../../env'

const env: IConfig = config

const { addMocksToSchema } = require('@graphql-tools/mock')

const createServer = () => {
  const server = new ApolloServer({
    schema: addMocksToSchema({ schema }),
    mockEntireSchema: false,
  })
  mongoose.connect(env.db as string, env.options)
  return server
}
export default createServer
