import { gql } from 'apollo-server-core'

export const TYPE_DEFS = gql`
  type Skill {
    id: ID
    title: String
    votes: Int
  }

  type Wilder {
    id: ID
    name: String
    city: String
    skills: [Skill]
  }

  input InputWilder {
    id: ID
    name: String!
    city: String!
  }

  type Query {
    allWilders: [Wilder]
  }

  type Mutation {
    createWilder(input: InputWilder): Wilder
    updateWilder(input: InputWilder): Wilder
    deleteWilder(id: String!): Wilder
  }
`
