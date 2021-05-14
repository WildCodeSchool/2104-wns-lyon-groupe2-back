const { ApolloServer, gql } = require('apollo-server')
import { TYPE_DEFS } from './models/typeDefs'
import { resolvers } from './resolvers/resolvers'
import mongoose from 'mongoose'
import { getOneUser } from './controllers/UserController'
import { config, IConfig } from '../env'

const env: IConfig = config

const server = new ApolloServer({
  typeDefs: TYPE_DEFS,
  resolvers: resolvers,
  context: async ({ req }: any) => {
    const token = req.headers.authorization || ''
    if (!token) {
      const user = null
      return { user }
    }
    const user = await getOneUser(token)
    return { user }
  },
});

(async () => {
  if (env.db !== undefined) {
    await mongoose.connect(env.db as string, env.options)
    console.log(`MonboDB is running, using the connection ${env.db}`)
  }
})()

server.listen().then((server: any) => {
  console.log(`🚀  Server ready at ${server.url}`)
})
