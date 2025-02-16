// resolvers.js
  import {
    gql
  } from 'apollo-server-express';
  import axios from 'axios';
  import puppeteer from 'puppeteer';
  import {
    format,
    subDays
  } from 'date-fns'; // Add date-fns for easier date manipulation


  import dotenv from 'dotenv';

  dotenv.config();
  const resolvers = {

    Query: {
      
      duneWalletHoldings: async (_, { address }) => {
        try {
          const response = await axios.get(`https://api.dune.com/api/echo/v1/balances/evm/${address}`, {
            headers: {
              'X-Dune-Api-Key': process.env.DUNE_API_KEY
            }
          });
  
          if (!response.data || !response.data.balances) {
            return [];
          }
  
          // Transform the data to match our needs
          return response.data.balances.map(balance => ({
            chain: balance.chain,
            chainId: balance.chain_id,
            tokenAddress: balance.address,
            amount: balance.amount,
            symbol: balance.symbol,
            name: balance.name,
            decimals: balance.decimals,
            priceUsd: balance.price_usd?.toString() || "0",
            valueUsd: balance.value_usd?.toString() || "0",
            poolSize: balance.pool_size?.toString() || "0",
            lowLiquidity: balance.low_liquidity || false
          }));
  
        } catch (error) {
          console.error('Failed to fetch data from Dune Echo API:', error);
          if (error.response) {
            console.error('Error response:', {
              status: error.response.status,
              data: error.response.data
            });
          }
          return [];
        }
      },
      
      duneSolanaWalletHoldings: async (_, { address }) => {
        try {
          const response = await axios.get(`https://api.dune.com/api/echo/beta/balances/svm/${address}`, {
            headers: {
              'X-Dune-Api-Key': process.env.DUNE_API_KEY
            }
          });

          if (!response.data || !response.data.balances) {
            return [];
          }

          // Transform the data to match our schema
          return response.data.balances.map(balance => ({
            chain: balance.chain,
            chainId: balance.chain_id || null,
            tokenAddress: balance.address|| null,
            amount: balance.amount,
            symbol: balance.symbol,
            name: balance.name || balance.symbol,
            decimals: balance.decimals,
            priceUsd: balance.price_usd ? Number(balance.price_usd) : 0,
            valueUsd: balance.value_usd ? Number(balance.value_usd) : 0,
            tokenMetadata: balance.token_metadata ? {
              logo: balance.token_metadata.logo,
              url: balance.token_metadata.url
            } : null
          }));

        } catch (error) {
          console.error('Failed to fetch Solana data from Dune Echo API:', error);
          if (error.response) {
            console.error('Error response:', {
              status: error.response.status,
              data: error.response.data
            });
          }
          return [];
        }
      }
    }


   




    //  query input addrress chain already filtered on the front-end  - souce : ./components/UI/WalletContext.jsx


    //query token current holding   - source: Nimbu API


    //query nft current holding   - source: Nimbu API


    // query BTC historical price  -  source: supra oracel API


    // query token latest price - source: supra oracel API



  };

  export {
    resolvers
  };