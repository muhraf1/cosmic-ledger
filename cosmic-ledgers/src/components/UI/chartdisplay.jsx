import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ChartDisplay = ({ data, chartType, holdingsData, selectedWallet, supraPrice }) => {
  // Error checking for required props
  if (!data && chartType !== 'pie') {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertDescription>
          No data available to display the chart.
        </AlertDescription>
      </Alert>
    );
  }

  if (chartType === 'pie' && !holdingsData) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertDescription>
          No holdings data available to display the distribution.
        </AlertDescription>
      </Alert>
    );
  }

  const processSupraHoldings = (scrapedData, currentPrice) => {
    try {
      if (!scrapedData || !currentPrice) return [];
      
      return scrapedData
        .filter(holding => holding && holding.symbol && holding.amount) // Validate data
        .map(holding => ({
          name: holding.symbol,
          value: parseFloat(holding.amount) * parseFloat(currentPrice)
        }))
        .filter(holding => !isNaN(holding.value) && holding.value > 0);
    } catch (error) {
      console.error('Error processing Supra holdings:', error);
      return [];
    }
  };

  const processStandardHoldings = (holdings) => {
    try {
      if (!holdings) return [];
      
      return holdings
        .filter(holding => holding && holding.symbol && holding.amount) // Validate data
        .map(holding => ({
          name: holding.symbol,
          value: parseFloat(holding.amount) * parseFloat(holding.price?.price || 0)
        }))
        .filter(holding => !isNaN(holding.value) && holding.value > 0);
    } catch (error) {
      console.error('Error processing standard holdings:', error);
      return [];
    }
  };

  if (chartType === 'pie') {
    let processedHoldings = [];
    
    try {
      if (selectedWallet?.chain === 'supra') {
        processedHoldings = processSupraHoldings(
          holdingsData?.scrapedTableData,
          supraPrice
        );
      } else {
        processedHoldings = processStandardHoldings(holdingsData?.walletHoldings);
      }

      if (processedHoldings.length === 0) {
        return (

          <Alert className="w-full">
            <AlertDescription>
              No valid holdings found to display.
            </AlertDescription>
          </Alert>
        );
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
    } catch (error) {
      console.error('Error rendering pie chart:', error);
      return (
        <Alert variant="destructive" className="w-full">
          <AlertDescription>
            Error displaying token distribution. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }
  }

  // Area chart for net worth over time
  try {
    const processedData = selectedWallet?.chain === 'supra' 
      ? data
          .filter(item => item && item.netWorth) // Validate data
          .map(item => ({
            ...item,
            netWorth: parseFloat(item.netWorth) * (supraPrice || 0)
          }))
          .filter(item => !isNaN(item.netWorth)) // Remove invalid calculations
      : data;

    if (processedData.length === 0) {
      return (
        
        <Alert className="w-full">
          <AlertDescription>
            No valid net worth data available to display.
          </AlertDescription>
        </Alert>
      );
    }

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
              try {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              } catch {
                return value;
              }
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
                  try {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  } catch {
                    return value;
                  }
                }}
                indicator="dot"
              />
            }
          />
          <Area dataKey="netWorth" type="natural" fill="url(#fillNetWorth)" stroke="#81638A" />
        </AreaChart>
      </ChartContainer>
    );
  } catch (error) {
    console.error('Error rendering area chart:', error);
    return (
      <Alert variant="destructive" className="w-full">
        <AlertDescription>
          Error displaying net worth chart. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
};

export default ChartDisplay;