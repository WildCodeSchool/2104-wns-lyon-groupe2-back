import { gql } from 'apollo-server-core'
import { ForbiddenError } from 'apollo-server'

import {
  allWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getMessageById,
} from '../controllers/WorkSpacesController'
import {
  createFeed,
  createMessageInFeed,
  createCommentInMessage,
  addLikeToMessage,
  addDislikeToMessage,
} from '../controllers/FeedController'
import { AnyNaptrRecord } from 'dns'

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
    allWorkspaces(input: InputWorkspaceGet!): [Workspaces]
    getWorkspaceById(input: WorkspaceId!): Workspaces
    getMessageById(input: InputMessages!): messages
  }
  extend type Mutation {
    createWorkspace(input: InputWorkspace!): Workspaces
    deleteWorkspace(input: WorkspaceId!): String
    updateWorkspace(input: UpdateWorkspace!): Workspaces
    createFeed(input: InputFeedCreate!): Workspaces
    createMessageInFeed(input: InputMessages!): Workspaces
    createCommentInMessage(input: InputComments!): Workspaces
    addLikeToMessage(input: InputLikeMessage!): Workspaces
    addDislikeToMessage(input: InputDislikeMessage!): Workspaces
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
  input InputWorkspaceGet {
    isSchoolWorkspace: Boolean!
    schoolId: String
  }
  input InputWorkspace {
    schoolId: String
    userAdmin: String
    isSchoolWorkspace: Boolean!
    usersAllowed: [String]!
    title: String!
    feed: [InputFeed]
    assets: [InputSharedAssets]
    visio: String
  }
  input UpdateWorkspace {
    id: ID!
    schoolId: String
    userAdmin: String
    isSchoolWorkspace: Boolean
    usersAllowed: [String]
    title: String
    feed: [InputFeed]
    assets: [InputSharedAssets]
    visio: String
  }

  input InputFeed {
    id: String
    feedName: String!
    messages: [InputMessages]
  }

  input InputFeedCreate {
    parentWorkspaceId: String!
    feedName: String!
  }

  input InputMessages {
    parentWorkspaceId: String!
    feedId: String!
    messageId: String
    messageContent: String
    userId: String
    createdAt: String
    assetId: String
    likes: Int
    dislikes: Int
    comments: [InputComments]
  }
  input InputComments {
    parentWorkspaceId: String!
    feedId: String!
    messageId: String!
    commentContent: String
    userId: String
    createdAt: String
  }
  input InputLikeMessage {
    parentWorkspaceId: String!
    feedId: String!
    messageId: String!
  }
  input InputDislikeMessage {
    parentWorkspaceId: String!
    feedId: String!
    messageId: String!
  }
  input InputSharedAssets {
    id: String
    assetName: String!
    folders: [InputSharedFolders]
  }
  input InputSharedFolders {
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
    allWorkspaces: (parent: any, args: AnyNaptrRecord, context: any) => {
      if (!context.user) {
        throw new ForbiddenError("You're not allowed to perform this operation")
      }
      return allWorkspaces(parent, args, context)
    },
    getWorkspaceById: getWorkspaceById,
    getMessageById: getMessageById,
  },
  Mutation: {
    createWorkspace: createWorkspace,
    updateWorkspace: updateWorkspace,
    deleteWorkspace: deleteWorkspace,
    createFeed: createFeed,
    createMessageInFeed: createMessageInFeed,
    createCommentInMessage: createCommentInMessage,
    addLikeToMessage: addLikeToMessage,
    addDislikeToMessage: addDislikeToMessage,
  },
}
