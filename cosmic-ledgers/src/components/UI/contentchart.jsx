

import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import { useQuery, gql } from '@apollo/client'; // Assuming Apollo Client is set up in your project
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import ChartDisplay from './ChartDisplay';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/UI/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select"

import ChartSwitch from "./chartswitch";

import { ChevronUp, ChartNoAxesColumnIncreasing, } from 'lucide-react';
import { useWalletContext } from "./WalletContext";



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


const GET_NET_WORTH_PERFORMANCE = gql`
  query GetNetWorthPerformance($address: String!, $startDate: String!, $endDate: String!) {
    getNetWorthPerformance(address: $address, startDate: $startDate, endDate: $endDate) {
      date
      netWorth
    }
  }
`;


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

const SCRAPED_TABLE_DATA = gql`
    query GetScrapedTableData($address: String!) {
        scrapedTableData(address: $address) {
            name
            symbol
            amount
            price
            value
        }
    }
`;



const Content = () => {
  const [activeChartType, setActiveChartType] = useState('bar');  
  const [timeRange, setTimeRange] = useState("90d");
  const [totalBalance, setTotalBalance] = useState(0); // State for total balance
  const { selectedWalletAddress, wallets } = useWalletContext();
  const selectedWallet = wallets.find(wallet => wallet.address === selectedWalletAddress);

  // const filteredData = chartData.filter((item) => {

  //   const date = new Date(item.date);
  //   const referenceDate = new Date("2024-06-30");
  //   let daysToSubtract = 90;

  //   if (timeRange === "30d") {
  //     daysToSubtract = 30;
  //   } else if (timeRange === "7d") {
  //     daysToSubtract = 7;
  //   }
  //   const startDate = new Date(referenceDate);
  //   startDate.setDate(startDate.getDate() - daysToSubtract);
  //   return date >= startDate;
  // });

  // console.log("check chart data ", filteredData);

  // Determine which query to use based on the selected wallet's chain



  const { loading: holdingsLoading, error: holdingsError, data: holdingsData } = useQuery(
    selectedWallet?.chain === 'supra' ? SCRAPED_TABLE_DATA : GET_WALLET_HOLDINGS,
    {
      variables: { address: selectedWalletAddress },
      skip: !selectedWalletAddress
    }
  );


  console.log("check holding data",holdingsData);
  // supra price
  const { loading: priceLoading, error: priceError, data: priceData } = useQuery(GET_SUPRA_PRICE);




  // Calculate end date as today, and start date based on time range
  const endDate = new Date().toISOString().split('T')[0];
  let startDate = new Date();
  switch (timeRange) {
    case "30d":
      startDate.setDate(startDate.getDate() - 30);
      break;
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    default: // 90d
      startDate.setDate(startDate.getDate() - 90);
  }
  startDate = startDate.toISOString().split('T')[0];

  const { loading: performanceLoading, error: performanceError, data: performanceData } = useQuery(
    GET_NET_WORTH_PERFORMANCE,
    {
      variables: { address: selectedWalletAddress, startDate, endDate },
      skip: !selectedWalletAddress
    }
  );

  const netWorthPerformance = performanceData?.getNetWorthPerformance || [];

  console.log("Check NetWorth Performanace Data",performanceData);
  console.log("Check NetWorth Performanace",netWorthPerformance);

  useEffect(() => {
    if (netWorthPerformance.length > 0) {
      setTotalBalance(parseFloat(netWorthPerformance[netWorthPerformance.length - 1].netWorth));
    } else {
      setTotalBalance(0);
    }
  }, [netWorthPerformance]);

  useEffect(() => {
    if (holdingsData) {
      let holdings = selectedWallet?.chain === 'supra' ? holdingsData.scrapedTableData : holdingsData.walletHoldings;
      if (!holdings || holdings.length === 0) {
        console.warn('No holdings data available for this address.');
        setTotalBalance(0);
        return;
      }

      let balance = 0;
      if (selectedWallet.chain === 'supra' && priceData?.getSupraPrice) {
        balance = calculateTotalBalanceSupra(holdings, priceData.getSupraPrice.price);
      } else {
        balance = calculateTotalBalance(holdings);
      }
      setTotalBalance(balance);
    }
  }, [holdingsData, priceData, selectedWalletAddress]);

  console.log("check selected wallet ", selectedWallet);
  console.log("check selected wallet chain", selectedWallet?.chain);

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
      let amount = parseFloat(holding.amount);
      if (!isNaN(amount)) {
        // Use the provided supraPrice for calculation
        total += amount * supraPrice;
        console.log(`Calculated value for ${holding.symbol}: ${amount * supraPrice}`);
      } else {
        console.warn('Could not parse amount for token:', holding.symbol, { amount: holding.amount });
      }
    }
    console.log('Total balance calculated for Supra:', total);
    return total;
  };

  console.log("check balance on content", totalBalance);
  console.log("check supra price", priceData?.getSupraPrice?.price);
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


  // loading 

  if (holdingsLoading || priceLoading || performanceLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }


  // if (netWorthPerformance.length === 0) {
  //   return (
  //     <Card className="py-2 px-4 bg-transparent" style={glassLayer2Styles}>
  //       <CardHeader>
  //         <CardTitle className="text-white/60 italic text-lg">No Data</CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <p className="text-white">No net worth performance data available for the selected period.</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }


  
// error

  if (performanceError) {
    return (
      <Card className="py-2 px-4 bg-transparent" style={glassLayer2Styles}>
        <CardHeader>
          <CardTitle className="text-white/60 italic text-lg">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white">Error loading net worth performance: {performanceError.message}</p>
        </CardContent>
      </Card>
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
                  maximumFractionDigits: 4
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
    setActiveChartType(type);
  }}
  defaultType="bar"
/>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-2  border-none  bg-transparent">
      <ChartDisplay 
  data={netWorthPerformance} 
  chartType={activeChartType === 'bar' ? 'area' : 'pie'}
  holdingsData={holdingsData}
  selectedWallet={selectedWallet}
  supraPrice={priceData?.getSupraPrice?.price}
/>
        <Navbar ></Navbar>
      </CardContent>


    </Card>

  );
}

export default Content;