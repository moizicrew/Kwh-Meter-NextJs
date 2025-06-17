"use client";

import { useEffect, useRef, useState } from "react";
import { client } from "../lib/mqtt-client";
import { Card, CardHeader, CardContent } from "./ui/card";
import { saveData, SaveHasil, SaveHasilSumber } from "@/app/server/action";
// import ApexChart from "react-apexcharts";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "./ui/chart";
import DashboardSidebar from "./DashboardSidebar";
import StatCard from "./StatCard";
import { ChartBarIcon, ChartLineIcon, ChartPieIcon } from "lucide-react";
import SalesChart from "./SalesChart";
import RevenueChart from "./RevenueChart";

type Candle = {
  month: number; // timestamp
  desktop: number; // open, high, low, close
};

const MQTTData = () => {
  // const session = auth();
  const [voltageR, setVoltageR] = useState<number | null>(null);
  const [voltageS, setVoltageS] = useState<number | null>(null);
  const [voltageT, setVoltageT] = useState<number | null>(null);
  const [currentR, setCurrentR] = useState<number>(0);
  const [currentS, setCurrentS] = useState<number>(0);
  const [currentT, setCurrentT] = useState<number>(0);
  const [totalEnergy, setTotalEnergy] = useState<number>(0);
  const [avgCurrents, setAvgCurrents] = useState<number>(0);
  const [avgVoltage, setAvgVoltage] = useState<number>(0);
  const [energyRecords, setEnergyRecords] = useState<number[]>([]);
  const [electricalBillHours, setElectricalBillHours] = useState<number>(0);
  const [electricalBillafter, setElectricalBillHoursafter] = useState<number>(0);
  

  const [inputKalibrasiR, setInputKalibrasiR] = useState<number>(0);
  const [inputKalibrasiS, setInputKalibrasiS] = useState<number>(0);
  const [inputKalibrasiT, setInputKalibrasiT] = useState<number>(0);
  const [inputValue1, setInputValue1] = useState<number>(5.75);
  const [persenadd, setPersenAdd] = useState<number>(1);

  const [realTime, setRealTime] = useState<string>(
    new Date().toLocaleTimeString()
  );
  // const [inputKalibrasiR, setInputKalibrasiR] = useState<number>(0);
  // const [inputKalibrasiS, setInputKalibrasiS] = useState<number>(0);
  // const [inputKalibrasiT, setInputKalibrasiT] = useState<number>(0);
  // const [inputValue1, setInputValue1] = useState<number>(5.75);
  const [withoutsBooster, setWithoutBooster] = useState<number>(0);
  // const [persenadd, setPersenAdd] = useState<number>(1);

  // const handleInputKalibrasiR = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputKalibrasiR(parseFloat(e.target.value) || 0);
  // };

  // const handleInputKalibrasiS = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputKalibrasiS(parseFloat(e.target.value) || 0);
  // };

  // const handleInputKalibrasiT = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputKalibrasiT(parseFloat(e.target.value) || 0);
  // };

  // const handleInputChangeS = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue1(parseFloat(e.target.value) || 0);
  // };

  // const handlePersenAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPersenAdd(parseFloat(e.target.value));
  // };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setRealTime(now.toLocaleTimeString("en-GB", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cosPhi = 0.95;
  const phaseMultiplier = 1.75;
  const LWBP_RATE = 1035.78;
  const WBP_RATE = 1553.67;
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [noDataAlert, setNoDataAlert] = useState<boolean>(false);
  const getTariff = () => {
    const hour = new Date().getHours();
    return hour >= 17 && hour < 23 ? WBP_RATE : LWBP_RATE;
  };

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch("/api/setting");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        if (data.setting) {
          setInputKalibrasiR(data.setting.multiplierR || 0);
          setInputKalibrasiS(data.setting.multiplierS || 0);
          setInputKalibrasiT(data.setting.multiplierT || 0);
          setPersenAdd(data.setting.persen || 0);
          setInputValue1(data.setting.divider || 5.75);
        }
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    };

    fetchSetting();
  }, []);

  // useEffect(() => {
  //   const fetchSetting = async () => {
  //     try {
  //       const res = await fetch("/api/data");
  //       if (!res.ok) throw new Error("Failed to fetch");

  //       const data = await res.json();
  //       if (data) {
  //       }
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Error fetching setting:", error);
  //     }
  //   };

  //   fetchSetting();
  // }, []);

  useEffect(() => {
    const handleMessage = (topic: string, message: Buffer) => {
      const value = parseFloat(message.toString());
      if (isNaN(value)) return;
      setLastUpdateTime(Date.now()); // Update setiap ada data masuk

      switch (topic) {
        case "SABDA/VR":
          setVoltageR(value);
          break;
        case "SABDA/VS":
          setVoltageS(value);
          break;
        case "SABDA/VT":
          setVoltageT(value);
          break;
        case "SABDA/IR":
          setCurrentR(parseFloat(value.toFixed(1)));
          break;
        case "SABDA/IS":
          setCurrentS(parseFloat(value.toFixed(1)));
          break;
        case "SABDA/IT":
          setCurrentT(parseFloat(value.toFixed(1)));
          break;
        default:
          break;
      }
      const handleSaveSumber = async () => {
        await SaveHasilSumber(topic, value);
      };

      handleSaveSumber();
    };

    client.on("message", handleMessage);
    return () => {
      client.off("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastUpdateTime;

      if (diff > 360000) {
        // jika lebih dari 5 detik tidak ada update
        setNoDataAlert(true);
      } else {
        setNoDataAlert(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdateTime]);

  const aftercurrentR = currentR / inputValue1 + inputKalibrasiR;
  const aftercurrentS = currentS / inputValue1 + inputKalibrasiS;
  const aftercurrentT = currentT / inputValue1 + inputKalibrasiT;

  useEffect(() => {
    if (
      aftercurrentR !== null &&
      aftercurrentS !== null &&
      aftercurrentT !== null
    ) {
      setAvgCurrents((aftercurrentR + aftercurrentS + aftercurrentT) / 3);
    }
  }, [aftercurrentR, aftercurrentS, aftercurrentT]); // Dependencies

  useEffect(() => {
    if (voltageR !== null && voltageS !== null && voltageT !== null) {
      setAvgVoltage((voltageR + voltageS + voltageT) / 3);
    }
  }, [voltageR, voltageS, voltageT]);

  useEffect(() => {
    if (
      avgCurrents !== null &&
      avgVoltage !== null &&
      avgCurrents > 0 &&
      avgVoltage > 0
    ) {
      const kwh = (phaseMultiplier * avgCurrents * avgVoltage * cosPhi) / 1000;
      if (isFinite(kwh)) {
        // Memastikan kwh bukan Infinity
        setTotalEnergy(kwh);
        // setAvgCurrents{avgCurrent};
        setEnergyRecords((prev) => [...prev, kwh]);
      }
    }
  }, [avgCurrents, avgVoltage]);

  useEffect(() => {
    if (energyRecords.length > 0) {
      const totalCost = energyRecords.reduce(
        (sum, kwh) => sum + (isFinite(kwh) ? kwh * getTariff() : 0),
        0
      );
      setElectricalBillHours(totalCost / energyRecords.length);
    }
  }, [energyRecords]);

  useEffect(() => {
    setElectricalBillHoursafter(electricalBillHours * 24 * 30);
  }, [electricalBillHours]);

  // const withoutBooster =
  //   avgCurrents !== null ? (avgCurrents * persenadd).toFixed(1) : "No data";

  // const withBooster = avgCurrents !== null ? avgCurrents.toFixed(1) : "No data";
  useEffect(() => {
    if (avgCurrents !== null) {
      setWithoutBooster(avgCurrents * 5.75);
    }
  }, [avgCurrents]); // Dependencies
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const monthlyEnergy =
    totalEnergy !== null ? (totalEnergy * 30).toFixed(2) : "No data";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  useEffect(() => {
    const handleSave = async () => {
      await saveData(
        avgCurrents,
        avgVoltage,
        avgCurrents,
        totalEnergy,
        electricalBillHours,
        (persenadd - 1) * 100
      );
    };

    const intervalId = setInterval(handleSave, 3600000);
    return () => clearInterval(intervalId); // cleanup
  }, [avgVoltage, avgCurrents, totalEnergy, electricalBillHours, persenadd]);

  useEffect(() => {
    const handleSaveHasil = async () => {
      await SaveHasil(withoutsBooster, avgCurrents);
    };

    setInterval(handleSaveHasil, 3600000);
  });

  // MQTT subscribe... (pake lib seperti mqtt.js)

  const [candles, setCandles] = useState<Candle[]>([]);
  const [candlesS, setCandlesS] = useState<Candle[]>([]);
  const [candlesT, setCandlesT] = useState<Candle[]>([]);
  const [candlesKwh, setCandlesKWh] = useState<Candle[]>([]);

  const tempValues = useRef<number[]>([]); // buffer per menit

  useEffect(() => {
    // Interval untuk menyimpan currentR setiap detik ke buffer
    const intervalPush = setInterval(() => {
      tempValues.current.push(currentR - 13000);
    }, 5000); // tiap 1 detik

    // console.log(tempValues);

    // Interval untuk membuat candlestick setiap 1 menit
    const intervalCandle = setInterval(() => {
      const vals = tempValues.current;
      if (vals.length === 0) return;

      const newCandle: Candle = {
        month: Date.now(),
        desktop: aftercurrentR,
      };
      // console.log(open);
      // console.log(newCandle);

      setCandles((prev) => [...prev.slice(-30), newCandle]); // max 30 candle
      tempValues.current = []; // reset buffer
    }, 5000); // tiap 1 menit

    return () => {
      clearInterval(intervalPush);
      clearInterval(intervalCandle);
    };
  }, [aftercurrentR]);

  useEffect(() => {
    // Interval untuk membuat candlestick setiap 1 menit
    const intervalCandle = setInterval(() => {
      const newCandle: Candle = {
        month: Date.now(),
        desktop: aftercurrentS,
      };
      // console.log(open);
      // console.log(newCandle);

      setCandlesS((prev) => [...prev.slice(-30), newCandle]); // max 30 candle
    }, 5000); // tiap 1 menit

    return () => {
      clearInterval(intervalCandle);
    };
  }, [aftercurrentS]);

  useEffect(() => {
    // Interval untuk membuat candlestick setiap 1 menit
    const intervalCandle = setInterval(() => {
      const newCandle: Candle = {
        month: Date.now(),
        desktop: aftercurrentT,
      };
      // console.log(open);
      // console.log(newCandle);

      setCandlesT((prev) => [...prev.slice(-30), newCandle]); // max 30 candle
    }, 5000); // tiap 1 menit

    return () => {
      clearInterval(intervalCandle);
    };
  }, [aftercurrentT]);

  useEffect(() => {
    // Interval untuk membuat candlestick setiap 1 menit
    const intervalCandle = setInterval(() => {
      const newCandle: Candle = {
        month: Date.now(),
        desktop: totalEnergy,
      };
      // console.log(open);
      // console.log(newCandle);

      setCandlesKWh((prev) => [...prev.slice(-30), newCandle]); // max 30 candle
    }, 5000); // tiap 1 menit

    return () => {
      clearInterval(intervalCandle);
    };
  }, [totalEnergy]);

  // console.log(candles);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  };

  const chartItems = [
    { label: "Arus R", data: candles },
    { label: "Arus S", data: candlesS },
    { label: "Arus T", data: candlesT },
    { label: "KWH", data: candlesKwh }
  ];

  return (
  <div className="flex min-h-screen bg-background">
    {/* Sidebar dengan width tetap */}
    <aside className="w-64 bg-muted shadow-md sticky top-0 h-screen z-10">
      <DashboardSidebar />
    </aside>

    {/* Main content */}
    <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
      {noDataAlert && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 shadow">
          ⚠️ 303 Booster Off
        </div>
      )}

      {/* Grid Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-xl mx-auto">
        {/* Kolom 1 */}
        <div className="space-y-6">
          <Card className="bg-muted p-6 rounded-2xl shadow">
            <CardHeader className="text-xl font-semibold">Without Booster</CardHeader>
            <CardContent>{formatCurrency(electricalBillafter * persenadd)}</CardContent>
          </Card>

          <Card className="bg-muted p-6 rounded-2xl shadow">
            <CardHeader className="text-xl font-semibold">With Booster</CardHeader>
            <CardContent>{formatCurrency(electricalBillafter)}</CardContent>
          </Card>

          <Card className="bg-muted p-6 rounded-2xl shadow">
            <CardHeader className="text-xl font-semibold">Monthly Energy Usage ({currentMonth})</CardHeader>
            <CardContent>{monthlyEnergy} kWh</CardContent>
          </Card>
        </div>

        {/* Kolom 2 */}
        <div className="space-y-6">
          {/* Voltages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[["R", voltageR], ["S", voltageS], ["T", voltageT]].map(([label, value]) => (
              <Card key={label} className="bg-muted p-4 rounded-xl shadow">
                <CardHeader className="text-lg font-semibold">Voltage {label}</CardHeader>
                <CardContent>{value != null ? `${Number(value).toFixed(2)} V` : "No data"}</CardContent>
              </Card>
            ))}
          </div>

          {/* Currents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[["R", aftercurrentR], ["S", aftercurrentS], ["T", aftercurrentT]].map(([label, value]) => (
              <Card key={label} className="bg-muted p-4 rounded-xl shadow">
                <CardHeader className="text-lg font-semibold">Current {label}</CardHeader>
                <CardContent>{value != null ? `${Number(value).toFixed(2)} A` : "No data"}</CardContent>
              </Card>
            ))}
          </div>

          {/* Informasi Lain */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted p-4 rounded-xl shadow">
              <CardHeader className="text-lg font-semibold">Current Time</CardHeader>
              <CardContent>{realTime}</CardContent>
            </Card>
            <Card className="bg-muted p-4 rounded-xl shadow">
              <CardHeader className="text-lg font-semibold">Total Energy</CardHeader>
              <CardContent>
                {totalEnergy !== null ? `${totalEnergy.toFixed(2)} kWh` : "No data"}
              </CardContent>
            </Card>
            <Card className="bg-muted p-4 rounded-xl shadow">
              <CardHeader className="text-lg font-semibold">Electrical Bill Per Hour</CardHeader>
              <CardContent>
                {electricalBillHours !== null ? `IDR ${formatCurrency(electricalBillHours)}` : "No data"}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-screen-xl mx-auto">
        {chartItems.map(({ label, data }, idx) => (
          <Card key={idx} className="rounded-2xl shadow">
            {label && (
              <CardHeader className="text-xl font-semibold px-6 pt-6">
                {label}
              </CardHeader>
            )}
            <CardContent className="h-[300px] px-6 pb-6">
              <ChartContainer config={chartConfig}>
                <LineChart
                  data={Array.isArray(data) ? data : []} // menghindari error jika data undefined
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    }
                  />
                  <YAxis tickFormatter={(value) => `${value} A`} />
                  <ChartTooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-background p-2 border rounded text-sm">
                          <p>{`${payload[0].value} A`}</p>
                          <p>
                            {new Date(payload[0].payload.month).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit"
                              }
                            )}
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="desktop" // pastikan data Anda punya key ini
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                    animationDuration={300}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  </div>
);
};

export default MQTTData;
