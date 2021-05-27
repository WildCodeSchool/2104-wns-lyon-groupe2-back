import { gql } from 'apollo-server-core'

export const TYPE_DEFS = gql`
  extend type Mutation {
    login(input: InputLogin!): AuthData
  }

  # Types _____________________________________________________
  type AuthData {
    token: String!
  }

  # Input _____________________________________________________
  input InputLogin {
    email: String!
    password: String!
  }
`
