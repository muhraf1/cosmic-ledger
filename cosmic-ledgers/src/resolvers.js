// resolvers.js
import { gql } from 'apollo-server-express';

const resolvers = {
  Query: {
    hello: () => {
      return 'Hello World!';
    },
  },
};

export { resolvers };