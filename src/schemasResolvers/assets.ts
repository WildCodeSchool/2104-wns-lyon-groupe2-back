import { gql } from 'apollo-server-core'
import { GraphQLUpload } from 'graphql-upload'
import * as fs from 'fs'
import * as path from 'path'

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
  scalar Upload
  extend type Query {
    allAssets: [Assets]
  }
  extend type Mutation {
    createAsset(input: InputAsset!): Assets
    deleteAsset(input: AssetId!): String
    updateAsset(input: UpdateAsset!): Assets
    singleUpload(data: Upload!): File!
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
  Upload: GraphQLUpload,
  Query: {
    allAssets: allAssets,
  },
  Mutation: {
    createAsset: createAsset,
    updateAsset: updateAsset,
    deleteAsset: deleteAsset,
    singleUpload: async (parent: any, { data }) => {
      console.log('coucou')
      console.log('args', data)
      const { createReadStream, filename, mimetype, encoding } = await data
      const stream = createReadStream()
      const pathName = path.join(__dirname, `../shared/ressources/${filename}`)
      await stream.pipe(fs.createWriteStream(pathName))
      return { url: `http://localhost:4000/src/shared/ressources/${filename}` }
    },
  },
}
