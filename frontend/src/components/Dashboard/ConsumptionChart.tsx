
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ConsumptionChartProps {
  title: string;
  description?: string;
  data: {
    date: string;
    value: number;
  }[];
  color: {
    main: string;
    light: string;
  };
  unit: string;
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({
  title,
  description,
  data,
  color,
  unit
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color.light} stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12}}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                unit={` ${unit}`}
                tick={{fontSize: 12}}
                tickMargin={10}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} ${unit}`, title]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color.main} 
                fillOpacity={1} 
                fill={`url(#color${title})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsumptionChart;
