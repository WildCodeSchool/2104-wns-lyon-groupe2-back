import { gql } from 'apollo-server-core'

export const TYPE_DEFS = gql`
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
  type Query {
    allUsers: [Users]
  }
  type Mutation {
    createUser(input: InputUser!): Users
    deleteUser(input: UserId!): String
    updateUser(input: UpdateUser!): Users
  }
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
`
