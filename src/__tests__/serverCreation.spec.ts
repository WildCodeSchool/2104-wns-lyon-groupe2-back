import createServer from './serverCreation'
import { GET_ALL_TAGS } from './query'
import MongoMemoryServer from 'mongodb-memory-server-core'

it('test our server connection', async () => {
  let apolloServer
  let mongoServer = new MongoMemoryServer()
  beforeAll(async () => {
    apolloServer = createServer()
  })

  const result = await apolloServer.executeOperation({
    query: GET_ALL_TAGS,
  })

  /*  expect(result.data.getAllTags).toEqual([
    { label: 'Hello World' },
    { label: 'Hello World' },
  ])
  expect(result.errors).toBe(undefined) */
})
