import { gql } from 'apollo-server-core'

export const GET_ALL_TAGS = gql`
  query Query {
    getAllTags {
      label
    }
  }
`
