import { gql } from 'apollo-server-core'

export const REGISTER_USER = gql`
  mutation registerUser($input: InputUser!) {
    registerUser(input: $input) {
      email
    }
  }
`
