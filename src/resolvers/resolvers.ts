import {
  registerUser,
  allUsers,
  deleteUser,
  updateUser,
} from '../controllers/UserController'
import { Login } from '../controllers/AuthController'

import { ForbiddenError } from 'apollo-server'

import {
  allWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from '../controllers/WorkSpacesController'

import {
  allAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from '../controllers/AssetController'

export const resolvers = {
  Query: {
    allUsers: allUsers,
    allWorkspaces: allWorkspaces,
    allAssets: allAssets,
  },
  Mutation: {
    login: Login,
    registerUser: (parent: any, args: any, context: any) => {
      if (!context.user || context.user.user_type !== 'admin')
        throw new ForbiddenError("You're not allowed to perform this operation")
      return registerUser(parent, args)
    },
    updateUser: updateUser,
    deleteUser: (parent: any, args: any, context: any) => {
      if (!context.user || context.user.user_type !== 'admin')
        throw new ForbiddenError("You're not allowed to perform this operation")
      return deleteUser(parent, args, context)
    },
    createWorkspace: createWorkspace,
    updateWorkspace: updateWorkspace,
    deleteWorkspace: deleteWorkspace,
    createAsset: createAsset,
    updateAsset: updateAsset,
    deleteAsset: deleteAsset,
  },
}
