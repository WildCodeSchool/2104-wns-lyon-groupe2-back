import { gql } from 'apollo-server-core'
import { createSchool } from '../controllers/SchoolController'

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
  # SCHOOL _____________________________________________________
  extend type Mutation {
    createSchool(input: InputSchool!): SchoolResult
  }
  # Types _____________________________________________________
  type SchoolResult {
    data: School
    user: Users
    workspace: Workspaces
  }
  type School {
    id: ID
    schoolName: String!
    logo: String
    firstname: String!
    lastname: String!
    email: String!
    primaryColor: String
    secondaryColor: String
  }

  type Users {
    id: ID
    lastname: String
    firstname: String
    email: String
    schoolId: String
    themeId: String
    userType: UserType
  }

  type Workspaces {
    id: ID
    schoolId: String
    userAdmin: String
    isSchoolWorkspace: Boolean
    usersAllowed: [String]
    title: String
    feed: [feed]
    assets: [sharedAssets]
    visio: String
  }
  type feed {
    id: String
    feedName: String
    messages: [messages]
  }
  type messages {
    id: String
    content: String
    userId: String
    userName: String
    color: String
    createdAt: String
    assetId: String
    likes: [like]
    dislikes: [dislike]
    comments: [comments]
  }
  type like {
    userId: String
    userName: String
  }
  type dislike {
    userId: String
    userName: String
  }
  type comments {
    id: String
    content: String
    userId: String
    userName: String
    color: String
    createdAt: String
  }
  type sharedAssets {
    id: String
    assetName: String
    folders: [folders]
  }
  type folders {
    id: String
    folderName: String
    parentId: String
    title: String
    assets: [sharedAssets]
  }

  # Inputs _____________________________________________________
  input InputSchool {
    id: ID
    firstname: String!
    lastname: String!
    email: String!
    schoolName: String
    logo: String
    primaryColor: String
    secondaryColor: String
  }
`

export const resolvers = {
  Query: {},
  Mutation: {
    createSchool: createSchool,
  },
}
