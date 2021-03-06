import { merge } from 'lodash'

import { typeDef as Assets, resolvers as assetsResolvers } from './assets'
import { typeDef as Auth, resolvers as authResolvers } from './auth'
import { typeDef as User, resolvers as userResolvers } from './user'
import { typeDef as Folders, resolvers as foldersResolvers } from './folders'
import {
  typeDef as Workspace,
  resolvers as workspaceResolvers,
} from './workspace'

import { makeExecutableSchema } from '@graphql-tools/schema'

const Query = `type Query {_empty:String}`

const Mutation = `type Mutation {_empty:String}`

// const resolvers = {}

export const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, Folders, Assets, Auth, User, Workspace],
  resolvers: merge(
    assetsResolvers,
    authResolvers,
    userResolvers,
    workspaceResolvers,
    foldersResolvers,
  ),
})
