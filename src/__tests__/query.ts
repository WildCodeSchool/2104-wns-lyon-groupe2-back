import { gql } from 'apollo-server-core'

export const GET_ALL_TAGS = gql`
  query Query {
    getAllTags {
      label
    }
  }
`

export const GET_ONE_USER = gql`
  query Query {
    getAllTests {
      title
    }
  }
`
