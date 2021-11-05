const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
import * as path from 'path'
import { schema } from './schemasResolvers/schema'
import mongoose from 'mongoose'
import { getOneUser } from './controllers/UserController'
import { config, IConfig } from '../env'
import { graphqlUploadExpress } from 'graphql-upload'

const env: IConfig = config
async function startServer() {
  const server = new ApolloServer({
    schema,
    context: async ({ req }: any) => {
      const token = req.headers.authorization || ''
      let user = null
      if (!token) {
        return { user }
      } else {
        try {
          user = await getOneUser(token)
        } catch (err) {
          user = null
        }
      }

      return { user }
    },
  })
  ;(async () => {
    if (env.db !== undefined) {
      await mongoose.connect(env.db as string, env.options)
      console.log(`MonboDB is running, using the connection ${env.db}`)
    }
  })()
  await server.start()
  const app = express()
  app.use(graphqlUploadExpress())
  server.applyMiddleware({ app })

  app.use(express.static(path.join(__dirname, './shared')))
  await new Promise((r) => app.listen({ port: 4000 }, r))
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}
startServer()
