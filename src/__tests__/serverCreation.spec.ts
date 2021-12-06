import createServer from './serverCreation'
import { GET_ALL_TAGS } from './query'
import MongoMemoryServer from 'mongodb-memory-server-core'
import { config } from '../../env'
import mongoose from 'mongoose'

let apolloServer
let mongo

describe('testing our server configuration', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create()
    config.db = mongo.getUri()
    apolloServer = await createServer(config)
  })
  afterAll(async () => {
    if (apolloServer !== null) {
      await apolloServer.stop()
    }
    await mongo.stop()
    await mongoose.disconnect()
  })
  it('test our server connection', async () => {
    const result = await apolloServer.executeOperation({
      query: GET_ALL_TAGS,
    })

    expect(result.data.getAllTags).toEqual([
      { label: 'Hello World' },
      { label: 'Hello World' },
    ])
    expect(result.errors).toBe(undefined)
  })
})
