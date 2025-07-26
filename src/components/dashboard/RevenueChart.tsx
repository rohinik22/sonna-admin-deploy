import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan 1', revenue: 12000 },
  { name: 'Jan 2', revenue: 19000 },
  { name: 'Jan 3', revenue: 16000 },
  { name: 'Jan 4', revenue: 22000 },
  { name: 'Jan 5', revenue: 18000 },
  { name: 'Jan 6', revenue: 24000 },
  { name: 'Jan 7', revenue: 21000 },
  { name: 'Jan 8', revenue: 23000 },
  { name: 'Jan 9', revenue: 27000 },
  { name: 'Jan 10', revenue: 25000 },
  { name: 'Jan 11', revenue: 29000 },
  { name: 'Jan 12', revenue: 26000 },
  { name: 'Jan 13', revenue: 31000 },
  { name: 'Jan 14', revenue: 28000 },
  { name: 'Jan 15', revenue: 32000 },
  { name: 'Jan 16', revenue: 29000 },
  { name: 'Jan 17', revenue: 34000 },
  { name: 'Jan 18', revenue: 31000 },
  { name: 'Jan 19', revenue: 36000 },
  { name: 'Jan 20', revenue: 33000 },
  { name: 'Jan 21', revenue: 38000 },
  { name: 'Jan 22', revenue: 35000 },
  { name: 'Jan 23', revenue: 40000 },
  { name: 'Jan 24', revenue: 37000 },
  { name: 'Jan 25', revenue: 42000 },
  { name: 'Jan 26', revenue: 39000 },
  { name: 'Jan 27', revenue: 44000 },
  { name: 'Jan 28', revenue: 41000 },
  { name: 'Jan 29', revenue: 46000 },
  { name: 'Jan 30', revenue: 43000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-primary">
          Revenue: <span className="font-semibold">₹{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  return (
    <div className="h-[250px] sm:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="name" 
            className="text-muted-foreground"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            hide={false}
          />
          <YAxis 
            className="text-muted-foreground"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${(value/1000)}k`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

RevenueChart.displayName = "RevenueChart";
