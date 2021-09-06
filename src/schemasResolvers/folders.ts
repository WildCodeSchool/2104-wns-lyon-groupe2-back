import { gql } from 'apollo-server-core'

import {
  allFolders,
  // createAsset,
  // updateAsset,
  // deleteAsset,
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
    folderByUserId: [Folder]
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
    userId: String
    createdAt: String
    name: string
    children: [ID]
    isRootDirectory: Boolean
  }

  # Inputs _____________________________________________________
  type Folder {
    id: ID!
    userId: String!
    name: string!
    children: [ID]
    isRootDirectory: Boolean!
  }

  input UpdateFolder {
    id: ID
    name: string
    children: [ID]
    isRootDirectory: Boolean
  }

  input FolderId {
    id: String
  }
`

export const resolvers = {
  Query: {
    allFolders: allFolders,
    // folderByUserId: folderByUserId,
  },
  Mutation: {
    // createFolder: createFolder,
    // updateAsset: updateFolder,
    // deleteAsset: deleteFolder,
  },
}
