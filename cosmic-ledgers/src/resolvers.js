  // resolvers.js
  import { gql } from 'apollo-server-express';
  import axios from 'axios';
  import puppeteer from 'puppeteer';
  import dotenv from 'dotenv'; // Add this line to import dotenv

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

      // supra fetch balance 
      scrapedTableData: async (_, { address }) => {
        try {
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
          await page.goto(`https://suprascan.io/address/${address}/f?tab=tokens&pageNo=1&rows=10`, { waitUntil: 'networkidle2' });
  
          const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table.resizer-table tbody tr'));
            return rows.map(row => {
              const [name, symbol, amount, price, value] = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
              return { name, symbol, amount, price, value };
            });
          });
  
          await browser.close();
          return data;
  
        } catch (error) {
          console.error('Error scraping table data:', error.message);
          return [];
        }
      },
  
      transactionTableData: async (_, { address }) => {
        try {
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
          await page.goto(`https://suprascan.io/address/${address}/f?tab=transactions&pageNo=1&rows=10`, { waitUntil: 'networkidle2' });
  
          const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table.resizer-table tbody tr'));
            return rows.map(row => {
              const cells = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
              return {
                status: cells[0],
                txHash: cells[1],
                block: cells[2],
                confirmationTime: cells[3],
                from: cells[4],
                to: cells[5],
                function: cells[6],
                txFee: cells[7]
              };
            });
          });
  
          await browser.close();
          return data;
  
        } catch (error) {
          console.error('Error scraping transaction data:', error.message);
          return [];
        }
      },

      getSupraPrice: async () => {
        try {
          const response = await fetch('https://prod-kline-rest.supra.com/latest?trading_pair=supra_usdt', {
            headers: {
              'x-api-key': process.env.SUPRA_ORACLE_API_KEY // Use the environment variable here
            }
          });
      
          if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
          }
      
          const data = await response.json();
          const priceInfo = data.instruments[0]; // Here's how to access the first (and only) item in the array
      
          return {
            price: parseFloat(priceInfo.currentPrice), // Ensure the price is a number
            timestamp: priceInfo.timestamp
          };
        } catch (error) {
          console.error('Failed to fetch Supra price:', error);
          return {
            price: 0, // Return a default value or handle error as needed
            timestamp: new Date().toISOString() // Use current timestamp if API fails
          };
        }
      }
    
    

      
    }
    



      //  query input addrress chain already filtered on the front-end  - souce : ./components/UI/WalletContext.jsx


      //query token current holding   - source: Nimbu API


      //query nft current holding   - source: Nimbu API


      // query BTC historical price  -  source: supra oracel API


      // query token latest price - source: supra oracel API









  };

  export { resolvers };