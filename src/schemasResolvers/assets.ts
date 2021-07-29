import { gql } from 'apollo-server-core'

import {
  allAssets,
  createAsset,
  updateAsset,
  deleteAsset,
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
   extend type Query {
    allAssets: [Assets]
  }
  extend type Mutation {
    createAsset(input: InputAsset!): Assets
    deleteAsset(input: AssetId!): String
    updateAsset(input: UpdateAsset!): Assets
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
    lastView: String
    likes: Int
    dislikes: Int
    bookmarkedCount: Int
    tags: [String]
    openingCount: Int
  }

  # Inputs _____________________________________________________
  input InputAsset {
    title: String
    type: String
    folders: [String]
    userId: String
    createdAt: String
    lastView: String
    likes: Int
    dislikes: Int
    bookmarkedCount: Int
    tags: [String]
    openingCount: Int
  }

  input UpdateAsset {
    id: String!
    title: String
    type: String
    folders: [String]
    userId: String
    createdAt: String
    lastView: String
    likes: Int
    dislikes: Int
    bookmarkedCount: Int
    tags: [String]
    openingCount: Int
  }

  input AssetId {
    id: String
  }
`

export const resolvers = {
  Query: {
    allAssets: allAssets,
  },
  Mutation: {
    createAsset: createAsset,
    updateAsset: updateAsset,
    deleteAsset: deleteAsset,
  },
}
