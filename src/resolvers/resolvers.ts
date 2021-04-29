import {
  createUser,
  allUsers,
  deleteUser,
  updateUser,
} from '../controllers/userController'

import {
  allWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from '../controllers/workSpacesController'

import {
  allAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from '../controllers/assetController'

export const resolvers = {
  Query: {
    allUsers: allUsers,
    allWorkspaces: allWorkspaces,
    allAssets: allAssets,
  },
  Mutation: {
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    createWorkspace: createWorkspace,
    updateWorkspace: updateWorkspace,
    deleteWorkspace: deleteWorkspace,
    createAsset: createAsset,
    updateAsset: updateAsset,
    deleteAsset: deleteAsset,
  },
}
