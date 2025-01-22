

import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import { useQuery, gql } from '@apollo/client'; // Assuming Apollo Client is set up in your project
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import ChartSwitch from "./chartswitch";

import { ChevronUp, ChartNoAxesColumnIncreasing, } from 'lucide-react';
import { useWalletContext } from "./WalletContext";


const chartData = [
  // ... (data array here)
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(270, 80%, 70%)", // Simplified for stroke, actual gradient for fill
  },
  mobile: {
    label: "Mobile",
    color: "hsl(285, 90%, 70%)", // Simplified for stroke, actual gradient for fill
  },
};

const GET_SUPRA_PRICE = gql`
  query GetSupraPrice {
    getSupraPrice {
      price
      timestamp
    }
  }
`;

const GET_WALLET_HOLDINGS = gql`
 query WalletHoldings($address: String!) {
  walletHoldings(address: $address) {
    owner
    cmc_id
    cg_id
    cmc_slug
    name
    symbol
    logo
    amount
    amountRaw
    balance
    contractAddress
    contractDecimals
    rate
    price {
      price
      symbol
      decimal
      source
    }
    last_24h_price {
      symbol
      price
      timestamp
      confidence
      source
    }
    avgCost
    last_transferred_at
    positionId
    category
    sector
    rank
    positionType
    chain
    is_spam
  }
}
`;




const Content = () => {
  const [timeRange, setTimeRange] = useState("90d");
  const [totalBalance, setTotalBalance] = useState(0); // State for total balance
  const { selectedWalletAddress } = useWalletContext();

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-11-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  const address = selectedWalletAddress; // Use the selected wallet's address
  console.log('Address content test:', address);


  const { loading: holdingsLoading, error: holdingsError, data: holdingsData } = useQuery(GET_WALLET_HOLDINGS, {
    variables: { address: selectedWalletAddress },
    skip: !selectedWalletAddress 
  });


  const { loading: priceLoading, error: priceError, data: priceData } = useQuery(GET_SUPRA_PRICE);



  useEffect(() => {
    if (holdingsData && holdingsData.walletHoldings) {
      let balance;
      if (selectedWalletAddress?.chain === 'supra' && priceData?.getSupraPrice) {
        balance = calculateTotalBalanceSupra(holdingsData.walletHoldings, priceData.getSupraPrice.price);
      } else {
        balance = calculateTotalBalance(holdingsData.walletHoldings);
      }
      setTotalBalance(balance);
    }
  }, [holdingsData, priceData, selectedWalletAddress]);

console.log('check chain',selectedWalletAddress?.chain);

  const calculateTotalBalance = (holdings) => {
    let total = 0;

    for (const holding of holdings) {
      const amount = parseFloat(holding.amount);
      const price = holding.price.price;
      console.log('check amount:', holding.amount);
      console.log('check price:', holding.price.price);

      // Calculate the value of each token before adding to total
      if (!isNaN(amount) && !isNaN(price)) {
        const tokenValue = amount * price;
        total += tokenValue;
        console.log('Token value:', tokenValue, 'for', holding.name);
      } else {
        console.warn('Invalid amount or price for token:', holding.name, holding.symbol, { amount, price });
      }
    }

    console.log('Total balance calculated:', total);
    return total;
  };



  const calculateTotalBalanceSupra = (holdings, supraPrice) => {
    let total = 0;
    for (const holding of holdings) {
      const amount = parseFloat(holding.amount);
      if (!isNaN(amount)) {
        total += amount * supraPrice;
      } else {
        console.warn('Invalid amount for token:', holding.name, holding.symbol, { amount });
      }
    }
    return total;
  };

  console.log("check balance on content", totalBalance);
  console.log("check supra price",)
  // console.log("check total balance",total);

  // Styles for glass effect
  const glassLayer2Styles = {
    background: 'linear-gradient(to bottom, rgba(129, 99, 138, 0.1), rgba(224, 173, 240, 0.3) )',
    // background:"transparent",
    opacity: 0.8,
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(186, 132, 244, 0.2)',
    borderRadius: '8px',
  };


  if (holdingsLoading || priceLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (holdingsError) {
    return <p>Error loading wallet holdings: {holdingsError.message}</p>;
  }

  if (priceError) {
    return <p>Error loading Supra price: {priceError.message}</p>;
  } 
  return (
    <Card className=" py-2 px-4 bg-transparent" style={glassLayer2Styles}>

      <CardHeader className="flex items-center gap-2 p-0 pt-2 sm:flex-row  px-3 border-none  bg-transparent">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          {/* title */}
          <CardTitle className="text-white/60 italic text-lg bg-transparent">Net worth  Performance</CardTitle>
          {/* amount & toggle chart */}
          <div className="flex justify-between">
            {/* amount */}
            <div className="flex-col">
            <span className="font-bold text-2xl text-white">
                {totalBalance.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 3
                })}
              </span>
             

            </div>


          </div>
        </div>
        {/* select picl date  & toggle chart  */}
        <div className="flex flex-col self-start ">

          <Select value={timeRange} onValueChange={setTimeRange} className="py-0">
            <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto font-medium bg-white/5 border py-0  border-white/10 text-white hover:text-white" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" className="text-white" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white/10 border border-white/10 ">
              <SelectItem value="90d" className="rounded-lg text-white">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg text-white">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg text-white">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="text-right pt-5">
            <ChartSwitch
              onSwitch={(type) => {
                // Handle the chart type change
                console.log(`Switched to ${type} chart`)
              }}
              defaultType="bar"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-2  border-none  bg-transparent">
        <ChartContainer config={chartConfig} className="aspect-auto h-[120px] w-full  bg-transparent">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              style={{
                fill: "var(--chart-axis-color)" // Use the CSS variable defined above
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" stroke="var(--color-mobile)" stackId="a" />
            <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" stroke="var(--color-desktop)" stackId="a" />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
          </AreaChart>
        </ChartContainer>
        <Navbar ></Navbar>
      </CardContent>


    </Card>

  );
}

export default Content;