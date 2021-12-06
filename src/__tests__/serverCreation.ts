import { ApolloServer } from 'apollo-server'
import { schema } from '../schemasResolvers/schema'
import mongoose from 'mongoose'

const { addMocksToSchema } = require('@graphql-tools/mock')

const createServer = async (config) => {
  const server = new ApolloServer({
    schema: addMocksToSchema({ schema }),
    mockEntireSchema: false,
  })
  // await server.listen(config.serverPort)
  await mongoose.connect(config.db as string, config.options)
  return server
}
export default createServer
