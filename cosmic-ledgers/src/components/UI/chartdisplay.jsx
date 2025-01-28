import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const ChartDisplay = ({ data, chartType, holdingsData, selectedWallet, supraPrice }) => {
  const processSupraHoldings = (scrapedData, currentPrice) => {
    if (!scrapedData || !currentPrice) return [];
    
    return scrapedData.map(holding => ({
      name: holding.symbol,
      value: parseFloat(holding.amount) * parseFloat(currentPrice)
    })).filter(holding => !isNaN(holding.value) && holding.value > 0);
  };

  const processStandardHoldings = (holdings) => {
    if (!holdings) return [];
    
    return holdings.map(holding => ({
      name: holding.symbol,
      value: parseFloat(holding.amount) * parseFloat(holding.price?.price || 0)
    })).filter(holding => !isNaN(holding.value) && holding.value > 0);
  };

  if (chartType === 'pie') {
    let processedHoldings = [];
    
    if (selectedWallet?.chain === 'supra') {
      processedHoldings = processSupraHoldings(
        holdingsData?.scrapedTableData,
        supraPrice
      );
    } else {
      processedHoldings = processStandardHoldings(holdingsData?.walletHoldings);
    }

    // Sort by value and take top 5 holdings
    const topHoldings = processedHoldings
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Calculate "Others" if there are more holdings
    if (processedHoldings.length > 5) {
      const othersValue = processedHoldings
        .slice(5)
        .reduce((sum, holding) => sum + holding.value, 0);
      
      topHoldings.push({
        name: 'Others',
        value: othersValue
      });
    }

    const COLORS = ['#81638A', '#9B7FA4', '#B59BBE', '#CFB7D8', '#E9D3F2', '#E0ADF0'];

    return (
      <ChartContainer config={{ netWorth: { label: "Token Distribution" } }} className="aspect-auto h-[120px] w-full bg-transparent">
        <PieChart>
          <Pie
            data={topHoldings}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
            paddingAngle={2}
            dataKey="value"
          >
            {topHoldings.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                strokeWidth={1}
                stroke="rgba(255,255,255,0.1)"
              />
            ))}
          </Pie>
          <Legend 
            align="right"
            verticalAlign="middle"
            layout="vertical"
            wrapperStyle={{
              paddingLeft: '1px'
            }}
            formatter={(value) => (
              <span className="text-[#DCCAE6] text-xs">{value}</span>
            )}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => value}
                valueFormatter={(value) => 
                  value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })
                }
              />
            }
          />
        </PieChart>
      </ChartContainer>
    );
  }

  // Area chart for net worth over time
  const processedData = selectedWallet?.chain === 'supra' 
    ? data.map(item => ({
        ...item,
        netWorth: parseFloat(item.netWorth) * (supraPrice || 0)
      }))
    : data;
    console.log("check data chartdisplay supra",processedData );

  return (
    <ChartContainer config={{ netWorth: { label: "Net Worth" } }} className="aspect-auto h-[120px] w-full bg-transparent">
      <AreaChart data={processedData}>
        <defs>
          <linearGradient id="fillNetWorth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#81638A" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#E0ADF0" stopOpacity={0.1} />
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
            fill: "var(--chart-axis-color)"
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
        <Area dataKey="netWorth" type="natural" fill="url(#fillNetWorth)" stroke="#81638A" />
      </AreaChart>
    </ChartContainer>
  );
};

export default ChartDisplay;