import {
  registerUser,
  allUsers,
  deleteUser,
  updateUser,
} from '../controllers/UserController'
import { Login } from '../controllers/AuthController'

import { ForbiddenError } from 'apollo-server'

export const resolvers = {
  Query: {
    allUsers: allUsers,
    login: Login,
  },
  Mutation: {
    registerUser: (parent: any, args: any, context: any) => {
      if (!context.user || context.user.user_type !== 'admin')
        throw new ForbiddenError("You're not allowed to perform this operation")
      return registerUser
    },
    updateUser: updateUser,
    deleteUser: (parent: any, args: any, context: any) => {
      if (!context.user || context.user.user_type !== 'admin')
        throw new ForbiddenError("You're not allowed to perform this operation")
      return deleteUser
    },
  },
}
