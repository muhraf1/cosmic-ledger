// server.js (using Express's built-in JSON middleware)
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

async function startServer() {
  const app = express();

  app.use(express.json()); // Use Express's built-in JSON middleware

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000/graphql`)
  );
}

startServer();