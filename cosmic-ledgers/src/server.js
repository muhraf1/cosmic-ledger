import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.json());

  // Configure Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://embeddable-sandbox.cdn.apollographql.com"],
        styleSrc: ["'self'", "https://embeddable-sandbox.cdn.apollographql.com"],
        imgSrc: ["'self'", "data:", "https://apollo-server-landing-page.cdn.apollographql.com"],
        connectSrc: ["'self'", "https://studio.apollographql.com"],
      }
    }
  }));

  // Enable detailed logging in development, but keep it minimal in production
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // CORS configuration; in production, you'll want to lock this down
  app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? '*' : process.env.CORS_ORIGIN || '*',
    optionsSuccessStatus: 200
  }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }) // This enables the sandbox
    ],
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  }));

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  const PORT = process.env.PORT || 4000;
  await new Promise(resolve => httpServer.listen(PORT, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});