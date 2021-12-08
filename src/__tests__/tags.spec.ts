import createServer from './serverCreation'
import MongoMemoryServer from 'mongodb-memory-server-core'
import { config } from '../../env'
import { GET_ALL_TAGS } from './query'

import mongoose from 'mongoose'
import { CREATE_TAGS } from './mutations'

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
  it('should create a tag', async () => {
    const result = await apolloServer.executeOperation({
      query: CREATE_TAGS,
      variables: {
        input: [{ label: 'test' }],
      },
    })
    expect(result.data).toBeDefined()
    // the test below fail for now
    const expected = [{ label: 'test' }]
    expect(result.data.createTag).toEqual(expect.arrayContaining(expected))
  })
  it('should return an error', async () => {
    const result = await apolloServer.executeOperation({
      query: CREATE_TAGS,
      variables: {
        input: [{ toto: 'error' }],
      },
    })
    expect(result.errors).toBeTruthy()
    expect(result.data).toBeFalsy()
  })
  it('test a random query without data', async () => {
    const result = await apolloServer.executeOperation({
      query: GET_ALL_TAGS,
    })
    expect(result.data.getAllTags).toEqual([{ label: 'test' }])
    expect(result.errors).toBe(undefined)
  })
})
