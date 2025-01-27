  // resolvers.js
  import { gql } from 'apollo-server-express';
  import axios from 'axios';
  import puppeteer from 'puppeteer';
  import { format, subDays } from 'date-fns'; // Add date-fns for easier date manipulation


  import dotenv from 'dotenv';

dotenv.config();
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
          // Changed URL to match the one you provided
          await page.goto(`https://suprascan.io/address/${address}/f?tab=transactions&pageNo=1&rows=10`, { waitUntil: 'networkidle2' });
      
          const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tr.hover\\:bg-gray-50'));
            return rows.map(row => {
              const tds = Array.from(row.querySelectorAll('td'));
              
              // Find the cell with the transaction hash link
              const txHashCell = tds.find(td => td.querySelector('a[href^="/tx/"]'));
              
              if (txHashCell) {
                const link = txHashCell.querySelector('a[href^="/tx/"]');
                const fullHashLink = link.getAttribute('href').split('/tx/')[1].split('/f')[0]; // Extract full txHash from href
                
                // Assuming the order of cells remains the same for other data
                return {
                  status: tds[0].innerText.trim(),
                  txHash: fullHashLink, // Here we use the full hash from the href
                  block: tds[2].innerText.trim(),
                  confirmationTime: tds[3].innerText.trim(),
                  from: tds[4].innerText.trim(),
                  to: tds[5].innerText.trim(),
                  function: tds[6].innerText.trim(),
                  txFee: tds[7].innerText.trim()
                };
              }
              return null; // In case no link is found for some reason
            }).filter(row => row !== null); // Filter out any null entries
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
              'x-api-key': process.env.SUPRA_ORACLE_API_KEY
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
      },





      getPriceHistory: async (_, { trading_pair, startDate, endDate, interval }) => {
        try {
          // Construct the URL parameters
          const params = new URLSearchParams({
            trading_pair,
            startDate,
            endDate,
            interval
          });
      
          // Construct the full URL
          const fullUrl = `https://prod-kline-rest.supra.com/history?${params.toString()}`;
          
          // Log the URL before executing the request
          console.log('Fetching price history from:', fullUrl);
      
          const response = await axios.get(fullUrl, {
            headers: {
              'x-api-key': process.env.SUPRA_ORACLE_API_KEY
            }
          });
      
          console.log("Response from API:", response.data); // Log the response data if needed
      
          // Map the data to match your GraphQL schema
          return response.data.map(data => ({
            time: data.time,
            timestamp: data.timestamp,
            open: data.open.toString(),
            high: data.high.toString(),
            low: data.low.toString(),
            close: data.close.toString()
          }));
        } catch (error) {
          console.error('Failed to fetch price history:', error.message);
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
          }
          return [];
        }
      },




      getNetWorthPerformance: async (_, { address, startDate, endDate }) => {
        try {
          console.log('Fetching holdings for address:', address);
          const holdings = await resolvers.Query.walletHoldings(_, { address });
          console.log('Holdings fetched:', holdings);
          
          if (!holdings || holdings.length === 0) {
            throw new Error('No holdings found for the given address.');
          }
      
          // Create an array of tokens from holdings
          const temp_tokens = holdings.map(holding => ({
            symbol: holding.symbol,
            amount: parseFloat(holding.amount) // Ensure amount is a number
          }));
          console.log('Temp tokens:', temp_tokens);
      
          // Fetch price history for each token
          console.log('Fetching price history for tokens from', startDate, 'to', endDate);
          
          const priceHistories = await Promise.all(
            temp_tokens.map(token => {
              console.log('Fetching price history for:', token.symbol);
              return resolvers.Query.getPriceHistory(_, { 
                trading_pair: `${token.symbol}_usdt`, 
                startDate, 
                endDate, 
                interval: '1d' 
              });
            })
          );
          console.log('Price histories fetched:', priceHistories);
      
          if (priceHistories.some(history => history.length === 0)) {
            throw new Error('Failed to retrieve price history for one or more tokens.');
          }
      
          // Calculate net worth for each day
          const netWorthPerDay = {};
          for (let day of priceHistories[0]) {
            const dateKey = format(new Date(day.timestamp), 'yyyy-MM-dd');
            netWorthPerDay[dateKey] = 0;
            
            for (let i = 0; i < temp_tokens.length; i++) {
              const token = temp_tokens[i];
              const dayPriceData = priceHistories[i].find(p => format(new Date(p.timestamp), 'yyyy-MM-dd') === dateKey);
              
              if (dayPriceData) {
                // Convert holding amount to USD value
                netWorthPerDay[dateKey] += token.amount * parseFloat(dayPriceData.close);
              } else {
                console.warn(`No price data for ${token.symbol} on ${dateKey}`);
              }
            }
          }
      
          console.log('Net worth per day calculated:', netWorthPerDay);
      
          const performanceData = Object.keys(netWorthPerDay).map(date => ({
            date: date,
            netWorth: netWorthPerDay[date].toFixed(2) // keep up to 2 decimal places
          })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
          console.log('Performance data:', performanceData);
          return performanceData;
      
        } catch (error) {
          console.error('Error calculating net worth performance:', error.message);
          if (error.message.includes('No holdings found')) {
            return [{ error: 'No holdings found for the address.' }];
          } else if (error.message.includes('Failed to retrieve price history')) {
            return [{ error: 'Failed to fetch price history for some tokens.' }];
          } else {
            return [{ error: 'An unexpected error occurred while calculating net worth performance.' }];
          }
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