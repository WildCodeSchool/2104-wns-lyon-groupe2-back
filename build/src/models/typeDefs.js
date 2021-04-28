"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPE_DEFS = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.TYPE_DEFS = apollo_server_core_1.gql `
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
`;
