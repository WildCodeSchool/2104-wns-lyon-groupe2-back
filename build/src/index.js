"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ApolloServer, gql } = require('apollo-server');
const typeDefs_1 = require("./models/typeDefs");
const resolvers_1 = require("./resolvers/resolvers");
const server = new ApolloServer({
    typeDefs: typeDefs_1.TYPE_DEFS,
    resolvers: resolvers_1.resolvers,
});
server.listen().then((server) => {
    console.log(`🚀  Server ready at ${server.url}`);
});
