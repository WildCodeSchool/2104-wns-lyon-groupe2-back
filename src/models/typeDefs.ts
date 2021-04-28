import { gql } from 'apollo-server-core';

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
`;
