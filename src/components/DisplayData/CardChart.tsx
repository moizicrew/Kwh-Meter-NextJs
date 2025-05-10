import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type ChartConfig = {
  desktop: {
    label: string;
    color: string;
  };
};

type Candle = {
  month: number; // timestamp
  desktop: number; // value
};

interface CardChartProps {
  title: string;
  chartConfig: ChartConfig;
  candlesKWH: Candle[];
}

const CardChart = ({ chartConfig, candlesKWH, title }: CardChartProps) => {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <LineChart
            data={candlesKWH}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => {
                // Konversi timestamp ke format waktu yang lebih pendek
                return new Date(value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value) => `${value} A`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background p-2 border rounded">
                      <p>{`${payload[0].value} A`}</p>
                      <p>
                        {new Date(payload[0].payload.month).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="desktop"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              animationDuration={300}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CardChart;
