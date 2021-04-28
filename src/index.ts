const { ApolloServer, gql } = require('apollo-server')
import { TYPE_DEFS } from './models/typeDefs'
import { resolvers } from './resolvers/resolvers'

const server = new ApolloServer({
  typeDefs: TYPE_DEFS,
  resolvers: resolvers,
})

server.listen().then((server: any) => {
  console.log(`🚀  Server ready at ${server.url}`)
})
