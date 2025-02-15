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
      walletHoldings: async (_, {
        address
      }) => {
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

      nftHoldings: async (_, {
        address
      }) => {
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
      scrapedTableData: async (_, {
        address
      }) => {
        try {
          const browser = await puppeteer.launch({
            headless: true
          });
          const page = await browser.newPage();
          await page.goto(`https://suprascan.io/address/${address}/f?tab=tokens&pageNo=1&rows=10`, {
            waitUntil: 'networkidle2'
          });

          const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table.resizer-table tbody tr'));
            return rows.map(row => {
              const [name, symbol, amount, price, value] = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
              return {
                name,
                symbol,
                amount,
                price,
                value
              };
            });
          });

          await browser.close();
          return data;

        } catch (error) {
          console.error('Error scraping table data:', error.message);
          return [];
        }
      },

      transactionTableData: async (_, {
        address
      }) => {
        try {
          const browser = await puppeteer.launch({
            headless: true
          });
          const page = await browser.newPage();
          // Changed URL to match the one you provided
          await page.goto(`https://suprascan.io/address/${address}/f?tab=transactions&pageNo=1&rows=10`, {
            waitUntil: 'networkidle2'
          });

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


      /// price history fo dialog
      getPriceHistoryDialog: async (_, {
        trading_pair,
        startDate,
        endDate,
        interval
      }) => {
        try {
          const params = new URLSearchParams({
            trading_pair,
            startDate,
            endDate,
            interval,
          });

          const fullUrl = `https://prod-kline-rest.supra.com/history?${params.toString()}`;
          console.log('Fetching price history from:', fullUrl);

          const response = await axios.get(fullUrl, {
            headers: {
              'x-api-key': process.env.SUPRA_ORACLE_API_KEY
            },
          });

          return response.data.map(data => ({
            time: data.time,
            timestamp: data.timestamp,
            close: data.close.toString(),
          }));
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log(`Instrument not found: ${trading_pair}`);
            return []; // Return an empty array instead of an object
          }

          console.error('Failed to fetch price history:', error.message);
          throw error; // Re-throw other errors to be handled by the parent resolver
        }
      },





      /// price history for networth
      getPriceHistory: async (_, {
        trading_pair,
        startDate,
        endDate,
        interval
      }) => {
        try {
          const params = new URLSearchParams({
            trading_pair,
            startDate,
            endDate,
            interval,
          });

          const fullUrl = `https://prod-kline-rest.supra.com/history?${params.toString()}`;
          console.log('Fetching price history from:', fullUrl);

          const response = await axios.get(fullUrl, {
            headers: {
              'x-api-key': process.env.SUPRA_ORACLE_API_KEY
            },
          });

          return {
            symbol: trading_pair.split('_')[0],
            exists: true,
            data: response.data.map(data => ({
              time: data.time,
              timestamp: data.timestamp,
              open: data.open.toString(),
              high: data.high.toString(),
              low: data.low.toString(),
              close: data.close.toString(),
            })),
          };
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log(`Instrument not found: ${trading_pair}`);
            return {
              symbol: trading_pair.split('_')[0],
              exists: false,
              data: []
            };
          }

          console.error('Failed to fetch price history:', error.message);
          throw error; // Re-throw other errors to be handled by the parent resolver
        }
      },





      getNetWorthPerformance: async (_, {
        address,
        startDate,
        endDate
       }) => {
        try {
          console.log('Fetching holdings for address:', address);
          const holdings = await resolvers.Query.walletHoldings(_, {
            address
          });
          //mock data 
          // const holdings = [
          //   {
          //     symbol: 'btc', 
          //     amount: '3'  
          //   },
          //   {
          //     symbol: 'eth',
          //     amount: '10'
          //   }
          // ];
          console.log('Holdings fetched:', holdings);

          if (!holdings || holdings.length === 0) {
            return [{
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: "0.00",
              error: 'No holdings found for the given address.'
            }];
          }

          // Filter out holdings with N/A symbols and validate amounts
          const validTokens = holdings
            .filter(holding => holding.symbol !== 'N/A')
            .map(holding => ({
              symbol: holding.symbol.toLowerCase(),
              amount: parseFloat(holding.amount) || 0
            }))
            .filter(token => token.amount > 0);

          console.log('Valid tokens for price fetch:', validTokens);

          if (validTokens.length === 0) {
            return [{
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: "0.00",
              error: 'No valid tokens found for price tracking.'
            }];
          }

          // Convert startDate and endDate to UNIX milliseconds
          const startTimestamp = new Date(startDate).getTime();
          const endTimestamp = new Date(endDate).getTime();

          // Fetch price histories with individual error handling
          console.log('Fetching price history for tokens from', startTimestamp, 'to', endTimestamp);
          const priceHistoriesResults = await Promise.all(
            validTokens.map(async token => {
              try {
                console.log('Fetching price history for:', token.symbol);
                const result = await resolvers.Query.getPriceHistory(_, {
                  trading_pair: `${token.symbol}_usdt`,
                  startDate: startTimestamp.toString(),
                  endDate: endTimestamp.toString(),
                  interval: '3600'
                });

                if (!result.exists) {
                  console.log(`Skipping ${token.symbol} - not found in price feed`);
                  return token;
                }

                return {
                  token,
                  history: result.data,
                  success: true
                };
              } catch (error) {
                console.error(`Error fetching price history for ${token.symbol}:`, error.message);
                return null;
              }
            })
          );

          // Filter out failed and skipped tokens
          const validPriceHistories = priceHistoriesResults.filter(
            result => result !== null && result.success && result.history.length > 0
          );

          if (validPriceHistories.length === 0) {
            return [{
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: "0.00",
              error: 'No valid price data available for any tokens.',
            }, ];
          }

          // Get unique dates from all histories
          const allDates = new Set();
          validPriceHistories.forEach(({
            history
          }) => {
            history.forEach(day => {
              allDates.add(format(new Date(day.timestamp), 'yyyy-MM-dd'));
            });
          });
          const sortedDates = Array.from(allDates).sort();

          // Calculate net worth for each day
          const performanceData = sortedDates.map(date => {
            let dailyNetWorth = 0;
            let availableTokens = 0;

            validPriceHistories.forEach(({
              token,
              history
            }) => {
              const dayPrice = history.find(p =>
                format(new Date(p.timestamp), 'yyyy-MM-dd') === date
              );

              if (dayPrice) {
                dailyNetWorth += token.amount * parseFloat(dayPrice.close);
                availableTokens++;
              }
            });

            return {
              date,
              netWorth: dailyNetWorth.toFixed(2),
              tokenCount: availableTokens,
              totalTokens: validTokens.length
            };
          });

          // Filter out days with zero net worth
          const finalPerformanceData = performanceData.filter(day =>
            parseFloat(day.netWorth) > 0 || day.tokenCount > 0
          );

          if (finalPerformanceData.length === 0) {
            return [{
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: "0.00",
              error: 'No days with valid price data found.'
            }];
          }

          console.log('Final performance data:', finalPerformanceData);
          return finalPerformanceData;

        } catch (error) {
          console.error('Error calculating net worth performance:', error);
          return [{
            date: format(new Date(), 'yyyy-MM-dd'),
            netWorth: "0.00",
            error: `Calculation error: ${error.message}`
          }];
        }
      },

      //get supra networth
      getSupraNetWorthPerformance: async (_, {
        address,
        startDate,
        endDate
       }) => {
        try {
          console.log('Fetching holdings for address:', address);
          const holdings = await resolvers.Query.scrapedTableData(_, {
            address
          });
          //mock data 
          // const holdings = [
          //   {
          //     symbol: 'btc', 
          //     amount: '3'  
          //   },
          //   {
          //     symbol: 'eth',
          //     amount: '10'
          //   }
          // ];
          console.log('Holdings fetched:', holdings);

          if (!holdings || holdings.length === 0) {
            return [{
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: "0.00",
              error: 'No holdings found for the given address.'
            }];
          }

          // Filter out holdings with N/A symbols and validate amounts
          const validTokens = holdings
            .filter(holding => holding.symbol !== 'N/A')
            .map(holding => ({
              symbol: holding.symbol.toLowerCase(),
              amount: parseFloat(holding.amount) || 0
            }))
            .filter(token => token.amount > 0);

          console.log('Valid tokens for price fetch:', validTokens);

          if (validTokens.length === 0) {
            return [{
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: "0.00",
              error: 'No valid tokens found for price tracking.'
            }];
          }

          // Convert startDate and endDate to UNIX milliseconds
          const startTimestamp = new Date(startDate).getTime();
          const endTimestamp = new Date(endDate).getTime();

          // Fetch price histories with individual error handling
          console.log('Fetching price history for tokens from', startTimestamp, 'to', endTimestamp);
          const priceHistoriesResults = await Promise.all(
            validTokens.map(async token => {
              try {
                console.log('Fetching price history for:', token.symbol);
                const result = await resolvers.Query.getPriceHistory(_, {
                  trading_pair: `${token.symbol}_usdt`,
                  startDate: startTimestamp.toString(),
                  endDate: endTimestamp.toString(),
                  interval: '3600'
                });

                if (!result.exists) {
                  console.log(`Skipping ${token.symbol} - not found in price feed`);
                  return token;
                }

                return {
                  token,
                  history: result.data,
                  success: true
                };
              } catch (error) {
                console.error(`Error fetching price history for ${token.symbol}:`, error.message);
                return null;
              }
            })
          );

          // Filter out failed and skipped tokens
          const validPriceHistories = priceHistoriesResults.filter(
            result => result !== null && result.success && result.history.length > 0
          );

          if (validPriceHistories.length === 0) {
            return [{
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: "0.00",
              error: 'No valid price data available for any tokens.',
            }, ];
          }

          // Get unique dates from all histories
          const allDates = new Set();
          validPriceHistories.forEach(({
            history
          }) => {
            history.forEach(day => {
              allDates.add(format(new Date(day.timestamp), 'yyyy-MM-dd'));
            });
          });
          const sortedDates = Array.from(allDates).sort();

          // Calculate net worth for each day
          const performanceData = sortedDates.map(date => {
            let dailyNetWorth = 0;
            let availableTokens = 0;

            validPriceHistories.forEach(({
              token,
              history
            }) => {
              const dayPrice = history.find(p =>
                format(new Date(p.timestamp), 'yyyy-MM-dd') === date
              );

              if (dayPrice) {
                dailyNetWorth += token.amount * parseFloat(dayPrice.close);
                availableTokens++;
              }
            });

            return {
              date,
              netWorth: dailyNetWorth.toFixed(2),
              tokenCount: availableTokens,
              totalTokens: validTokens.length
            };
          });

          // Filter out days with zero net worth
          const finalPerformanceData = performanceData.filter(day =>
            parseFloat(day.netWorth) > 0 || day.tokenCount > 0
          );

          if (finalPerformanceData.length === 0) {
            return [{
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: "0.00",
              error: 'No days with valid price data found.'
            }];
          }

          console.log('Final performance data:', finalPerformanceData);
          return finalPerformanceData;

        } catch (error) {
          console.error('Error calculating net worth performance:', error);
          return [{
            date: format(new Date(), 'yyyy-MM-dd'),
            netWorth: "0.00",
            error: `Calculation error: ${error.message}`
          }];
        }
      },
      
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