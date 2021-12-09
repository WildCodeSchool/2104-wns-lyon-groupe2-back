import createServer from './serverCreation'
import { REGISTER_USER } from './mutations'
import MongoMemoryServer from 'mongodb-memory-server-core'
import { config } from '../../env'
import mongoose from 'mongoose'
import UserModel from '../models/userModel'
import { GET_ALL_USERS } from './query'

let apolloServer
let mongo

jest.setTimeout(20000)

describe('testing user manipluation', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create()
    config.db = mongo.getUri()
    apolloServer = await createServer(config)
    await UserModel.init()
    const model = await new UserModel({
      firstname: 'Donald',
      lastname: 'Duck',
      email: 'donald.d@disney.com',
    })
    await model.save()
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
          lastname: 'Jumper',
          firstname: 'Joly',
          email: 'jj@gmail.com',
          schoolId: '1',
          userType: 'ADMIN',
          isSchoolAdmin: true,
        },
      },
      http: { headers: { authorization: config.tokenForTest } },
    })
    expect(addUser.errors).toBeUndefined()
    expect(addUser.data.registerUser).toEqual({ email: 'jj@gmail.com' })
  })
  it('should return the first user created in the beforeAll', async () => {
    const getOneUser = await apolloServer.executeOperation({
      query: GET_ALL_USERS,
    })
    const result = [
      {
        firstname: 'Donald',
        lastname: 'Duck',
        email: 'donald.d@disney.com',
      },
      { lastname: 'Jumper', firstname: 'Joly', email: 'jj@gmail.com' },
    ]
    expect(getOneUser.data).toBeDefined()
    expect(getOneUser.data.allUsers).toEqual(result)

    expect(getOneUser.errors).toBeUndefined()
  })
})
