import {
  createUser,
  allUsers,
  deleteUser,
  updateUser,
} from '../controllers/userController'

import {
  allWorkspaces,
  createWorkspaces,
  updateWorkspaces,
  deleteWorkspaces,
} from '../controllers/workspacesController'

export const resolvers = {
  Query: {
    allUsers: allUsers,
    allWorkspaces: allWorkspaces,
  },
  Mutation: {
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    createWorkspaces: createWorkspaces,
    updateWorkspaces: updateWorkspaces,
    deleteWorkspaces: deleteWorkspaces,
  },
}
