import { gql } from 'apollo-server-core'
import {
  registerUser,
  allUsers,
  deleteUser,
  updateUser,
  getOneUser,
} from '../controllers/UserController'
import { ForbiddenError } from 'apollo-server'

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
    allUsers: [Users]
    getOneUser(token: String!): Users
  }
  extend type Mutation {
    deleteUser(input: UserId!): String
    updateUser(input: UpdateUser!): Users
    registerUser(input: InputUser!): Users
  }

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

  input InputWorkspacesAdmin {
    id: String
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
    # password: String!
    # passwordConfirmation: String!
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

  input UserId {
    id: String
  }
`

export const resolvers = {
  UserType: {
    STUDENT: 'student',
    ADMIN: 'admin',
    TEACHER: 'teacher',
  },
  Query: {
    allUsers: allUsers,
    getOneUser: (args: any) => getOneUser(args),
  },
  Mutation: {
    registerUser: (parent: any, args: any, context: any) => {
      console.log(context)
      if (!context.user || context.user.userType !== 'admin') {
        throw new ForbiddenError("You're not allowed to perform this operation")
      }
      return registerUser(parent, args)
    },
    updateUser: updateUser,
    deleteUser: (parent: any, args: any, context: any) => {
      if (!context.user || context.user.userType !== 'admin') {
        throw new ForbiddenError("You're not allowed to perform this operation")
      }
      return deleteUser(parent, args, context)
    },
  },
}
