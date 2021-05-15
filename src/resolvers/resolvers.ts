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

//////////////////////////////////////////////////////////////////////////////////////////
// Resolvers tell Apollo Server how to fetch the data associated with a particular type.//
// Resolvers define the technique for fetching the types defined in the schema          //
//////////////////////////////////////////////////////////////////////////////////////////

export const resolvers = {
  UserType: {
    STUDENT: 'student',
    ADMIN: 'admin',
    TEACHER: 'teacher',
  },
  Query: {
    allUsers: allUsers,
    allWorkspaces: allWorkspaces,
    allAssets: allAssets,
  },
  Mutation: {
    login: Login,
    registerUser: (parent: any, args: any, context: any) => {
      if (!context.user || context.user.userType !== 'admin')
        throw new ForbiddenError("You're not allowed to perform this operation")
      return registerUser(parent, args)
    },
    updateUser: updateUser,
    deleteUser: (parent: any, args: any, context: any) => {
      if (!context.user || context.user.userType !== 'admin')
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
