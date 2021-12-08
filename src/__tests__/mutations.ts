import { gql } from 'apollo-server-core'

export const REGISTER_USER = gql`
  mutation registerUser($input: InputUser!) {
    registerUser(input: $input) {
      email
    }
  }
`

export const CREATE_TAGS = gql`
  mutation createTag($input: [InputTag!]) {
    createTag(input: $input) {
      label
    }
  }
`
