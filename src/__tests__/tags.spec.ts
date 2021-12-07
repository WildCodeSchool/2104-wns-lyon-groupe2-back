import createServer from './serverCreation'
import MongoMemoryServer from 'mongodb-memory-server-core'
import { config } from '../../env'
import { GET_ALL_TAGS } from './query'

import mongoose from 'mongoose'

let apolloServer
let mongo
jest.setTimeout(20000)

describe('testing tags manipulation', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create()
    config.db = mongo.getUri()
    apolloServer = await createServer(config)
  })
  afterAll(() => {
    if (apolloServer !== null) {
      apolloServer.stop()
    }
    mongo.stop()
    mongoose.disconnect()
  })
  it('test a random query without data', async () => {
    const result = await apolloServer.executeOperation({
      query: GET_ALL_TAGS,
    })
    expect(result.data.getAllTags).toEqual([])
    expect(result.errors).toBe(undefined)
  })
})
