import {
  createUser,
  allUsers,
  deleteUser,
  updateUser,
} from '../controllers/UserController'
import { Login } from '../controllers/AuthController'

export const resolvers = {
  Query: {
    allUsers: allUsers,
    login: Login,
  },
  Mutation: {
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
  },
}
