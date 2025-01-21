  // resolvers.js
  import { gql } from 'apollo-server-express';
  import axios from 'axios';

  const resolvers = {
    Query: {
      walletHoldings: async (_, { address }) => {
        try {
          const response = await axios.get(`https://api.getnimbus.io/v2/address/${address}/holding`, {
            headers: {
              'accept': 'application/json'
            }
          });

          // Ensure we're returning an array
          if (!response.data) {
            return [];
          }

          // If the API returns an object with a data property containing the array
          if (response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
          }

          // If the API directly returns an array
          if (Array.isArray(response.data)) {
            return response.data;
          }

          // If we can't determine the structure, return empty array
          console.error('Unexpected API response structure:', response.data);
          return [];

        } catch (error) {
          console.error('Failed to fetch data from REST API:', error);
          
          // Log detailed error information
          if (error.response) {
            console.error('Error response:', {
              status: error.response.status,
              data: error.response.data
            });
          }
          
          return [];
        }
      },

      nftHoldings: async (_, { address }) => {
        try {
          const response = await axios.get(`https://api.getnimbus.io/v2/address/${address}/nft-holding`, {
            headers: {
              'accept': 'application/json'
            }
          });

          // Ensure we're returning an array
          if (!response.data) {
            return [];
          }

          // If the API returns an object with a data property containing the array
          if (response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
          }

          // If the API directly returns an array
          if (Array.isArray(response.data)) {
            return response.data;
          }

          // If we can't determine the structure, return empty array
          console.error('Unexpected API response structure:', response.data);
          return [];

        } catch (error) {
          console.error('Failed to fetch data from REST API:', error);
          
          // Log detailed error information
          if (error.response) {
            console.error('Error response:', {
              status: error.response.status,
              data: error.response.data
            });
          }
          
          return [];
        }
      },

      
    }
    



      //  query input addrress chain already filtered on the front-end  - souce : ./components/UI/WalletContext.jsx


      //query token current holding   - source: Nimbu API


      //query nft current holding   - source: Nimbu API


      // query BTC historical price  -  source: supra oracel API


      // query token latest price - source: supra oracel API









  };

  export { resolvers };