import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Middleware for JSON parsing (which you already have)
  app.use(express.json());

  // Enable CORS for handling cross-origin requests
  app.use(cors());

  // Configure Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  await server.start();

  // Apply ApolloServer middleware to the /graphql endpoint
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({ req }), // Optionally, pass request context
  }));

  // Here we handle any other routes or middleware if needed
  // app.get('*', (req, res) => {
  //   res.send('Hello from Apollo Server with Express!');
  // });

  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});