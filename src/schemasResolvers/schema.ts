import { makeExecutableSchema } from "apollo-server";
import {merge} from "lodash";

import {typeDef as Assets, resolvers as assetsResolvers} from "./assets"
// import {typeDef as Auth} from "./assets"
// import {typeDef as User} from "./assets"
// import {typeDef as Workspace} from "./assets"

const Query = `
type Query {
  _empty:String
}`;

const Mutation = `
type Mutation {
  _empty:String
}`;

// const resolvers = {}

export const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, Assets],
  resolvers: merge(assetsResolvers)
//   typeDefs: [Assets, Auth, User, Workspace]
})
