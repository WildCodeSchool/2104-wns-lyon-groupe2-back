import { ApolloServer } from 'apollo-server-express'
import { schema } from '../schemasResolvers/schema'
import { GET_ALL_TAGS } from './query'

const { addMocksToSchema } = require('@graphql-tools/mock')
const { makeExecutableSchema } = require('@graphql-tools/schema')

it('should return a list of tags', async () => {
  const server = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({ schema }),
    }),
  })

  const result = await server.executeOperation({
    query: GET_ALL_TAGS,
    variables: { id: 1 },
  })
})
