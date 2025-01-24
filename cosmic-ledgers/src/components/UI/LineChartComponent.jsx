import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { gql, useQuery } from '@apollo/client';


const GET_PRICE_HISTORY = gql`
  query GetPriceHistory($trading_pair: String!, $startDate: String!, $endDate: String!, $interval: String!) {
    getPriceHistory(
      trading_pair: $trading_pair, 
      startDate: $startDate, 
      endDate: $endDate, 
      interval: $interval
    ) {
      time
      timestamp
      close
    }
  }
`;

export function LineChartComponent({ symbol }) {
  // Memoize date calculations
  const { startDate, endDate, tradingPair } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    return {
      startDate: start.getTime().toString(),
      endDate: end.getTime().toString(),
      tradingPair: `${symbol.toLowerCase()}_usdt`
    };
  }, [symbol]);

  // Use skip to prevent unnecessary calls
  const { data, loading, error } = useQuery(GET_PRICE_HISTORY, {
    variables: { 
      trading_pair: tradingPair, 
      startDate, 
      endDate, 
      interval: '3600' 
    },
    fetchPolicy: 'cache-first', // Prefer cached data
    nextFetchPolicy: 'cache-only', // Use cache for subsequent calls
    notifyOnNetworkStatusChange: false // Reduce re-renders
  });

  // Memoized chart data preparation
  const chartData = useMemo(() => {
    if (!data?.getPriceHistory) return [];
    
    return data.getPriceHistory.map(item => ({
      name: format(new Date(parseInt(item.time)), 'MM/dd HH:mm'),
      close: parseFloat(item.close)
    }));
  }, [data]);

  console.log("check chart data")

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ResponsiveContainer width="95%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3"  vertical={false}/>
        <XAxis dataKey="name" />
        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `$${value.toFixed(2)}`}
        />
        <Tooltip 
          formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Price']}
        />
        <Line 
          type="monotone" 
          dataKey="close" 
          stroke="#8884d8" 
          strokeWidth={2} 
          // Hide dots but show them on hover
          dot={false}
          activeDot={{ r: 4 }} // This dot will appear on hover
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;