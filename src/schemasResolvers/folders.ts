import { gql } from 'apollo-server-core'
import { ForbiddenError } from 'apollo-server'

import {
  allFolders,
  createFolder,
  foldersByCurrentUserId,
  updateFolder,
  deleteFolder,
} from '../controllers/FolderController'

/////////////////////////////////////////////////////////////////
// here we define the structure of data that clients can query //
/////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TIPS                                                                                                                                                           //
// Field names should use camelCase. Many GraphQL clients are written in JavaScript, Java, Kotlin, or Swift, all of which recommend camelCase for variable names.//
// Type names should use PascalCase. This matches how classes are defined in the languages mentioned above.                                                      //
// Enum names should use PascalCase.                                                                                                                             //
// Enum values should use ALL_CAPS, because they are similar to constants.                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const typeDef = gql`
  extend type Query {
    allFolders: [Folder]
    foldersByCurrentUserId(parentDirectory: String): [Folder]
  }
  extend type Mutation {
    createFolder(input: InputFolder!): Folder
    deleteFolder(input: FolderId!): String
    updateFolder(input: UpdateFolder!): Folder
  }

  # FOLDERS _____________________________________________________
  # Types _____________________________________________________
  type Folder {
    id: ID
    sequence: Int
    userId: String
    createdAt: String
    name: String
    parentDirectory: String
    isRootDirectory: Boolean
  }

  # Inputs _____________________________________________________
  input InputFolder {
    name: String!
    parentDirectory: ID
    isRootDirectory: Boolean!
  }

  input UpdateFolder {
    id: ID!
    sequence: Int
    name: String
    parentDirectory: ID
    isRootDirectory: Boolean
  }

  input FolderId {
    id: String
  }
`

export const resolvers = {
  Query: {
    allFolders: allFolders,
    foldersByCurrentUserId: (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new ForbiddenError("You're not allowed to perform this operation")
      }
      return foldersByCurrentUserId(parent, args, context)
    },
  },
  Mutation: {
    createFolder: (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new ForbiddenError("You're not allowed to perform this operation")
      }
      return createFolder(parent, args, context)
    },
    updateFolder: (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new ForbiddenError("You're not allowed to perform this operation")
      }
      return updateFolder(parent, args, context)
    },
    deleteFolder: (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new ForbiddenError("You're not allowed to perform this operation")
      }
      return deleteFolder(parent, args, context)
    },
  },
}
