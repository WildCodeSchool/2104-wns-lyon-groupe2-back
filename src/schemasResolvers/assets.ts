import { gql } from 'apollo-server-core'
import { GraphQLUpload } from 'graphql-upload'
import { ForbiddenError } from 'apollo-server'

import {
  allAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  uploadAssets,
  getAssetsByFolderId,
} from '../controllers/AssetController'

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
  scalar Upload
  extend type Query {
    allAssets: [Assets]
    getAssetsByFolderId(folderId: String!): [Assets]
  }
  extend type Mutation {
    createAsset(input: InputAsset!): Assets
    deleteAsset(input: [String]): String
    updateAsset(input: UpdateAsset!): Assets
    uploadFile(data: Upload!, folderId: String!): File!
  }

  # ASSETS _____________________________________________________
  # Types _____________________________________________________
  type Assets {
    id: ID
    title: String!
    type: String
    folders: [String]
    userId: String
    createdAt: String
    updatedAt: String
    lastView: String
    likes: Int
    dislikes: Int
    bookmarkedCount: Int
    tags: [String]
    openingCount: Int
    size: Int
    url: String
  }

  type File {
    url: String!
  }

  # Inputs _____________________________________________________
  input InputAsset {
    title: String
    type: String
    folders: [String]
    userId: String
    createdAt: String
    updatedAt: String
    lastView: String
    likes: Int
    dislikes: Int
    bookmarkedCount: Int
    tags: [String]
    openingCount: Int
    size: Int
    url: String
  }

  input UpdateAsset {
    id: String!
    title: String
    type: String
    folders: [String]
    userId: String
    createdAt: String
    updatedAt: String
    lastView: String
    likes: Int
    dislikes: Int
    bookmarkedCount: Int
    tags: [String]
    openingCount: Int
    size: Int
    url: String
  }

  input AssetId {
    id: [String]
  } 
  
`

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    allAssets: allAssets,
    getAssetsByFolderId: (
      parent: any,
      args: { folderId: String },
      context: any,
    ) => {
      if (!context.user)
        throw new ForbiddenError("You're not allowed to perform this operation")
      return getAssetsByFolderId(parent, args, context)
    },
  },
  Mutation: {
    createAsset: createAsset,
    updateAsset: updateAsset,
    deleteAsset: deleteAsset,
    uploadFile: uploadAssets,
  },
}
