import { ApolloServer } from 'apollo-server'
import { schema } from '../schemasResolvers/schema'
import mongoose from 'mongoose'

const createServer = async (config) => {
  const server = new ApolloServer({
    schema,
    context: { user: { userType: 'ADMIN' } },
  })
  await server.listen(config.serverPortTest)
  //don't remove the "useless" await below, it's not useless...
  await mongoose.connect(config.db as string, config.options)
  return server
}
export default createServer
