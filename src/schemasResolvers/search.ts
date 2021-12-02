import { gql } from 'apollo-server-core'

import { searchEverywhere } from '../controllers/searchController'

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
  # extend type Query {
  # }
  extend type Mutation {
    search(input: InputSearch!): SearchResult
  }

  # ASSETS _____________________________________________________
  # Types _____________________________________________________
  type SearchResult {
    assets: [Assets]
    folders: [Folders]
    users: [Users]
  }

  type Assets {
    _id: ID
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

  type Folders {
    path: [Path]
    folders: [Folder]
  }

  type Path {
    name: String
    id: String
  }

  type Folder {
    _id: ID
    sequence: Int
    userId: String
    createdAt: String
    name: String
    parentDirectory: String
    isRootDirectory: Boolean
    path: [String]
  }

  type Users {
    _id: ID
    lastname: String
    firstname: String
    avatar: String
    email: String
    schoolId: String
    themeId: String
    isSchoolAdmin: Boolean
    userType: UserType
    workspacesAdmin: [WorkspacesAdmin]
    reset_password_token: String
    reset_password_expires: String
    first_connection: Boolean
    color: String
    age: String
    city: String
    bio: String
  }

  type WorkspacesAdmin {
    id: ID
  }

  # Inputs _____________________________________________________
  input InputSearch {
    keywords: String
  }
`

export const resolvers = {
  // Query: {},
  Mutation: {
    search: searchEverywhere,
  },
}
