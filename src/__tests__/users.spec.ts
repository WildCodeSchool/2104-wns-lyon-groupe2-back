import createServer from './serverCreation'
import { REGISTER_USER } from './mutations'
import MongoMemoryServer from 'mongodb-memory-server-core'
import { config } from '../../env'
import mongoose from 'mongoose'

let apolloServer
let mongo

jest.setTimeout(20000)

describe('testing user manipluation', () => {
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

  it('should returned the created user', async () => {
    const addUser = await apolloServer.executeOperation({
      query: REGISTER_USER,
      variables: {
        input: {
          lastname: 'Gorenflot',
          firstname: 'Antoine',
          email: 'a@a.com',
          schoolId: '1',
          userType: 'ADMIN',
          isSchoolAdmin: true,
        },
      },
    })
    expect(addUser.errors).toBeUndefined()
    expect(addUser.data.registerUser).toEqual({ email: 'a@a.com' })
  })
})
