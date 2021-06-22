import { gql } from 'apollo-server-core'
import {
  allWorkspaces_isSchool,
  allWorkspaces_isNotSchool,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from '../controllers/WorkSpacesController'

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
    allWorkspaces_isSchool: [Workspaces]
    allWorkspaces_isNotSchool: [Workspaces]
  }
  extend type Mutation {
    createWorkspace(input: InputWorkspace!): Workspaces
    deleteWorkspace(input: WorkspaceId!): String
    updateWorkspace(input: UpdateWorkspace!): Workspaces
  }

  # Types _____________________________________________________
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
    createdAt: String
    assetId: String
    likes: Int
    dislikes: Int
    comments: [comments]
  }
  type comments {
    id: String
    content: String
    userId: String
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
  input InputWorkspace {
    schoolId: String
    userAdmin: String
    isSchoolWorkspace: Boolean!
    usersAllowed: [String]
    title: String!
    feed: [InputFeed]
    assets: [InputSharedAssets]
    visio: String
  }
  input UpdateWorkspace {
    id: ID!
    schoolId: String
    userAdmin: String
    isSchoolWorkspace: Boolean!
    usersAllowed: [String]
    title: String!
    feed: [InputFeed]
    assets: [InputSharedAssets]
    visio: String
  }

  input InputFeed {
    id: String
    feedName: String!
    messages: [InputMessages]
  }
  input InputMessages {
    id: String
    content: String
    userId: String
    createdAt: String
    assetId: String
    likes: Int
    dislikes: Int
    comments: [InputComments]
  }
  input InputComments {
    id: String
    content: String
    userId: String
    createdAt: String
  }
  input InputSharedAssets {
    id: String
    assetName: String!
    folders: [InputFolders]
  }
  input InputFolders {
    id: String
    folderName: String
    parentId: String
    title: String
    assets: [InputSharedAssets]
  }

  input WorkspaceId {
    id: String
  }
`

export const resolvers = {
  Query: {
    allWorkspaces_isSchool: allWorkspaces_isSchool,
    allWorkspaces_isNotSchool: allWorkspaces_isNotSchool,
  },
  Mutation: {
    createWorkspace: createWorkspace,
    updateWorkspace: updateWorkspace,
    deleteWorkspace: deleteWorkspace,
  },
}
