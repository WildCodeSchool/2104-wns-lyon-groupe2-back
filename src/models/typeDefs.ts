import { gql } from 'apollo-server-core'

export const TYPE_DEFS = gql`
  type Query {
    allUsers: [Users]
    allWorkspaces: [Workspaces]
  }
  type Mutation {
    createUser(input: InputUser!): Users
    deleteUser(input: UserId!): String
    updateUser(input: UpdateUser!): Users
    createWorkspaces(input: InputWorkspaces!): Workspaces
    deleteWorkspaces(input: WorkspaceId!): String
    updateWorkspaces(input: UpdateWorkspaces!): Workspaces
  }

  # USERS _____________________________________________________
  # Types _____________________________________________________
  type Users {
    id: ID
    lastname: String
    firstname: String
    avatar: String
    email: String
    password: String
    school_id: String
    theme_id: String
    is_school_admin: Boolean
    user_type: String
    workspaces_admin: [WorkspacesAdmin]
  }
  type WorkspacesAdmin {
    id: ID
  }

  # Inputs _____________________________________________________
  input InputUser {
    lastname: String!
    firstname: String!
    avatar: String
    email: String!
    password: String!
    school_id: String!
    theme_id: String
    is_school_admin: Boolean!
    user_type: String!
    workspaces_admin: [InputWorkspacesAdmin]
  }
  input UpdateUser {
    id: String!
    lastname: String
    firstname: String
    avatar: String
    email: String
    password: String
    school_id: String
    theme_id: String
    is_school_admin: Boolean
    user_type: String
    workspaces_admin: [InputWorkspacesAdmin]
  }
  input InputWorkspacesAdmin {
    id: String
  }
  input UserId {
    id: String
  }

  # WORKSPACES _____________________________________________________
  # Types _____________________________________________________
  type Workspaces {
    id: ID
    school_id: String
    user_admin: String
    is_school_workspace: Boolean
    users_allowed: [String]
    title: String
    feed: [feed]
    assets: [assets]
    visio: String
  }
  type feed {
    id: String
    feed_name: String
    messages: [messages]
  }
  type messages {
    id: String
    content: String
    user_id: String
    created_at: String
    asset_id: String
    likes: Int
    dislikes: Int
    comments: [comments]
  }
  type comments {
    id: String
    content: String
    user_id: String
    created_at: String
  }
  type assets {
    id: String
    asset_name: String
    folders: [folders]
  }
  type folders {
    id: String
    folder_name: String
    parent_id: String
    title: String
    assets: [assets]
  }

  # Inputs _____________________________________________________
  input InputWorkspaces {
    school_id: String
    user_admin: String
    is_school_workspace: Boolean!
    users_allowed: [String]
    title: String!
    feed: [InputFeed]
    assets: [InputAssets]
    visio: String
  }
  input UpdateWorkspaces {
    id: ID!
    school_id: String
    user_admin: String
    is_school_workspace: Boolean!
    users_allowed: [String]
    title: String!
    feed: [InputFeed]
    assets: [InputAssets]
    visio: String
  }

  input InputFeed {
    id: String
    feed_name: String!
    messages: [InputMessages]
  }
  input InputMessages {
    id: String
    content: String
    user_id: String
    created_at: String
    asset_id: String
    likes: Int
    dislikes: Int
    comments: [InputComments]
  }
  input InputComments {
    id: String
    content: String
    user_id: String
    created_at: String
  }
  input InputAssets {
    id: String
    asset_name: String!
    folders: [InputFolders]
  }
  input InputFolders {
    id: String
    folder_name: String
    parent_id: String
    title: String
    assets: [InputAssets]
  }

  input WorkspaceId {
    id: String
  }
`
