"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const ranges = ["1D", "1W", "1M"];

export default function ChartWithRange({}) {
  const [range, setRange] = useState("1D");
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    async function fetchCandles() {
      const res = await fetch(`/api/data?range=${range}`);
      const data = await res.json();
      setCandles(data);
    }

    fetchCandles();
  }, [range]);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  };

//   console.log(candles[0].desktop);
//   const candless = aggregateData(candles);
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={range === r ? "font-bold" : ""}
          >
            {r === "1D" ? "1 Hari" : r === "1W" ? "1 Minggu" : "1 Bulan"}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>Energi</CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <LineChart
              data={candles}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="month"
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
              <YAxis tickFormatter={(value) => `${value} A`} />
              <ChartTooltip
                content={({ active, payload }) =>
                  active && payload && payload.length ? (
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
                  ) : null
                }
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
    </div>
  );
}

interface MqttData {
  timestamp: string; // atau Date jika kamu sudah parse
  value: number;
}

interface Candle {
  month: number; // timestamp (ms)
  desktop: number; // average value
}
function aggregateData(
  data: MqttData[],
  intervalMs: number = 10 * 60 * 1000
): Candle[] {
  if (!Array.isArray(data)) return [];

  const result: Candle[] = [];

  let startTime = new Date(data[0]?.timestamp).getTime();
  let bucket: MqttData[] = [];

  for (const item of data) {
    const time = new Date(item.timestamp).getTime();

    if (time - startTime < intervalMs) {
      bucket.push(item);
    } else {
      if (bucket.length > 0) {
        const avg = bucket.reduce((sum, d) => sum + d.value, 0) / bucket.length;
        result.push({
          month: startTime,
          desktop: avg,
        });
      }
      // reset
      startTime = time;
      bucket = [item];
    }
  }

  // final bucket
  if (bucket.length > 0) {
    const avg = bucket.reduce((sum, d) => sum + d.value, 0) / bucket.length;
    result.push({
      month: startTime,
      desktop: avg,
    });
  }

  return result;
}
