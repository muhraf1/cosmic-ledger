"use client"

import { format, parseISO } from 'date-fns';
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { gql, useQuery } from '@apollo/client';

const GET_PRICE_HISTORY = gql`
  query GetPriceHistory($trading_pair: String, $startDate: String, $endDate: String, $interval: String) {
    getPriceHistory(
      trading_pair: $trading_pair, 
      startDate: $startDate, 
      endDate: $endDate, 
      interval: $interval
    ) {
      time
      timestamp
      open
      high
      low
      close
    }
  }
`;

const chartConfig = {
  close: {
    label: "Close Price",
  },
} 

export function LineChartComponent() {
  // Calculate start and end dates
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7); // Last 7 days

  const { loading, error, data } = useQuery(GET_PRICE_HISTORY, {
    
  });
  


  console.log("check chart data", data);
  // Prepare chart data
  const chartData = data?.getPriceHistory?.map(item => ({
    name: format(parseISO(item.time), 'MM/dd HH:mm'),
    close: item.close
  })) || [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>BTC Price History</CardTitle>
        <CardDescription>
          {format(startDate, 'MMMM dd')} - {format(endDate, 'MMMM dd, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip 
              labelFormatter={(value) => `Time: ${value}`}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Close Price']}
            />
            <Line
              dataKey="close"
              type="natural"
              // stroke="#FF5733"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default LineChartComponent;