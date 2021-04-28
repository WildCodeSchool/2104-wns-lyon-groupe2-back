import {
  createUser,
  allUsers,
  deleteUser,
  updateUser,
} from '../controllers/userController'

export const resolvers = {
  Query: {
    allUsers: allUsers,
  },
  Mutation: {
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
  },
}
