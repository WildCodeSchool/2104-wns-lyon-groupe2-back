import { gql } from 'apollo-server-core'
import { GraphQLUpload } from 'graphql-upload'
import { ForbiddenError } from 'apollo-server'
import {
  createTag,
  getAllTags,
  tagsAutocomplete,
} from '../controllers/TagsController'

// TODO \\
/////////////////////////////////////////////////////////////////
//                   write resolvers here                      //
/////////////////////////////////////////////////////////////////

export const typeDef = gql`
  extend type Query {
    getAllTags: [Tags]
    tagsAutocomplete(input: InputAutocomplete!): [Tags]
  }
  extend type Mutation {
    createTag(input: [InputTag!]): Tags
  }
  # ASSETS _____________________________________________________
  # Types _____________________________________________________
  type Tags {
    title: String
  }
  # Inputs _____________________________________________________
  input InputTag {
    title: String
  }
  input InputAutocomplete {
    title: String
  }
`
export const resolvers = {
  Query: {
    getAllTags: getAllTags,
    tagsAutocomplete: tagsAutocomplete,
  },
  Mutation: {
    createTag: createTag,
  },
}
