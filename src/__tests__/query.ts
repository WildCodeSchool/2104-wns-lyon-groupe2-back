import { gql } from 'apollo-server-core'

export const GET_ALL_TAGS = gql`
  query Query {
    getAllTags {
      label
    }
  }
`

export const GET_ALL_USERS = gql`
  query Query {
    allUsers {
      firstname
      lastname
      email
    }
  }
`
