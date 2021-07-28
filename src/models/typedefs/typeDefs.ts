import { gql } from 'apollo-server-core'

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

export const TYPE_DEFS = gql`
  type Query {
    allUsers: [Users]
    allWorkspaces: [Workspaces]
    getWorkspaceById: Workspaces
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
    schoolIdd: String
    themeId: String
    isSchoolAdmin: Boolean
    userType: UserType
    workspacesAdmin: [WorkspacesAdmin]
  }

  type WorkspacesAdmin {
    id: ID
  }

  enum UserType {
    STUDENT
    ADMIN
    TEACHER
  }

  # Inputs _____________________________________________________
  input InputUser {
    lastname: String!
    firstname: String!
    avatar: String
    email: String!
    password: String!
    passwordConfirmation: String!
    schoolId: String!
    themeId: String
    isSchoolAdmin: Boolean!
    userType: UserType!
    workspacesAdmin: [InputWorkspacesAdmin]
  }
  input UpdateUser {
    id: String!
    lastname: String
    firstname: String
    avatar: String
    email: String
    password: String!
    schoolId: String
    themeId: String
    isSchoolAdmin: Boolean
    userType: UserType
    workspacesAdmin: [InputWorkspacesAdmin]
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
    # assetId: String
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
