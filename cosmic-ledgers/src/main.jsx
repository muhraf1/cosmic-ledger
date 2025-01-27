import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
import './index.css'; 
import App from './App.jsx';

Amplify.configure(amplifyconfig);

const apolloClient = new ApolloClient({
  uri: process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/graphql' 
    : process.env.REACT_APP_GRAPHQL_API_URL || '',
  cache: new InMemoryCache(),
});

const client = process.env.NODE_ENV === 'development' ? apolloClient : generateClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);