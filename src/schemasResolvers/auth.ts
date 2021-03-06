import { gql } from 'apollo-server-core'
import { Login, isAuth } from '../controllers/AuthController'

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
  extend type Mutation {
    login(input: InputLogin!): AuthData
    isAuth(input: Token!): AuthResponse
  }

  # AUTHENTICATION _____________________________________________________
  # Types _____________________________________________________
  type AuthData {
    token: String!
  }
  type AuthResponse {
    auth: Boolean!
    message: String!
  }

  # Input _____________________________________________________
  input InputLogin {
    email: String!
    password: String!
    remember: Boolean!
  }
  input Token {
    token: String!
  }
`

export const resolvers = {
  Mutation: {
    login: Login,
    isAuth: isAuth,
  },
}
