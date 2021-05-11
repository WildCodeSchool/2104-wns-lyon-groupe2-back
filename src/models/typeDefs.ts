import { gql } from 'apollo-server-core'

// here we de fine the types used by graphql

export const TYPE_DEFS = gql`
  type Query {
    allUsers: [Users]
    allWorkspaces: [Workspaces]
    allAssets: [Assets]
  }
  type Mutation {
    login(input: InputLogin!): AuthData
    createUser(input: InputUser!): Users
    deleteUser(input: UserId!): String
    updateUser(input: UpdateUser!): Users
    registerUser(input: InputUser!): Users
    createWorkspace(input: InputWorkspace!): Workspaces
    deleteWorkspace(input: WorkspaceId!): String
    updateWorkspace(input: UpdateWorkspace!): Workspaces
    createAsset(input: InputAsset!): Assets
    deleteAsset(input: AssetId!): String
    updateAsset(input: UpdateAsset!): Assets
  }

  # AUTHENTICATION _____________________________________________________
  # Types _____________________________________________________
  type AuthData {
    token: String!
  }

  # Input _____________________________________________________
  input InputLogin {
    email: String!
    password: String!
  }

  # USERS _____________________________________________________
  # Types _____________________________________________________
  type Users {
    id: ID
    lastname: String
    firstname: String
    avatar: String
    email: String
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
    password_confirmation: String!
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
    password: String!
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
    assets: [sharedAssets]
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
  type sharedAssets {
    id: String
    asset_name: String
    folders: [folders]
  }
  type folders {
    id: String
    folder_name: String
    parent_id: String
    title: String
    assets: [sharedAssets]
  }

  # Inputs _____________________________________________________
  input InputWorkspace {
    school_id: String
    user_admin: String
    is_school_workspace: Boolean!
    users_allowed: [String]
    title: String!
    feed: [InputFeed]
    assets: [InputSharedAssets]
    visio: String
  }
  input UpdateWorkspace {
    id: ID!
    school_id: String
    user_admin: String
    is_school_workspace: Boolean!
    users_allowed: [String]
    title: String!
    feed: [InputFeed]
    assets: [InputSharedAssets]
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
  input InputSharedAssets {
    id: String
    asset_name: String!
    folders: [InputFolders]
  }
  input InputFolders {
    id: String
    folder_name: String
    parent_id: String
    title: String
    assets: [InputSharedAssets]
  }

  input WorkspaceId {
    id: String
  }

  # ASSETS _____________________________________________________
  # Types _____________________________________________________
  type Assets {
    id: ID
    title: String!
    type: String
    folders: [String]
    user_id: String
    created_at: String
    last_view: String
    likes: Int
    dislikes: Int
    bookmarked_count: Int
    tags: [String]
    opening_count: Int
  }

  # Inputs _____________________________________________________
  input InputAsset {
    title: String
    type: String
    folders: [String]
    user_id: String
    created_at: String
    last_view: String
    likes: Int
    dislikes: Int
    bookmarked_count: Int
    tags: [String]
    opening_count: Int
  }

  input UpdateAsset {
    id: String!
    title: String
    type: String
    folders: [String]
    user_id: String
    created_at: String
    last_view: String
    likes: Int
    dislikes: Int
    bookmarked_count: Int
    tags: [String]
    opening_count: Int
  }

  input AssetId {
    id: String
  }
`
