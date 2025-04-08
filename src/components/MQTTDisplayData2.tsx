"use client";

import { useEffect, useState } from "react";
import { client } from "../lib/mqtt-client";
import { Card, CardHeader, CardContent } from "./ui/card";
import { saveData, SaveHasil, SaveHasilSumber } from "@/app/server/action";

const MQTTData = () => {
  const [voltageR, setVoltageR] = useState<number | null>(null);
  const [voltageS, setVoltageS] = useState<number | null>(null);
  const [voltageT, setVoltageT] = useState<number | null>(null);
  const [currentR, setCurrentR] = useState<number>(0);
  const [currentS, setCurrentS] = useState<number>(0);
  const [currentT, setCurrentT] = useState<number>(0);
  const [totalEnergy, setTotalEnergy] = useState<number>(0);
  const [avgCurrents, setAvgCurrents] = useState<number>(0);
  const [energyRecords, setEnergyRecords] = useState<number[]>([]);
  const [electricalBillHours, setElectricalBillHours] = useState<number>(0);

  const [realTime, setRealTime] = useState<string>(
    new Date().toLocaleTimeString()
  );
  const [inputKalibrasiR, setInputKalibrasiR] = useState<number>(0);
  const [inputKalibrasiS, setInputKalibrasiS] = useState<number>(0);
  const [inputKalibrasiT, setInputKalibrasiT] = useState<number>(0);
  const [inputValue1, setInputValue1] = useState<number>(5.75);
  const [withoutsBooster, setWithoutBooster] = useState<number>(0);
  const [persenadd, setPersenAdd] = useState<number>(1);

  const handleInputKalibrasiR = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputKalibrasiR(parseFloat(e.target.value) || 0);
  };

  const handleInputKalibrasiS = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputKalibrasiS(parseFloat(e.target.value) || 0);
  };

  const handleInputKalibrasiT = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputKalibrasiT(parseFloat(e.target.value) || 0);
  };

  const handleInputChangeS = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue1(parseFloat(e.target.value) || 0);
  };

  const handlePersenAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersenAdd(parseFloat(e.target.value));
  };

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

      if (diff > 5000) {
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
  const avgVoltage =
    voltageR !== null && voltageS !== null && voltageT !== null
      ? (voltageR + voltageS + voltageT) / 3
      : null;

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

  const withoutBooster =
    avgCurrents !== null ? (avgCurrents * persenadd).toFixed(1) : "No data";

  const withBooster = avgCurrents !== null ? avgCurrents.toFixed(1) : "No data";
  useEffect(() => {
    if (avgCurrents !== null) {
      setWithoutBooster(avgCurrents * persenadd);
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
      await saveData(avgCurrents, totalEnergy, electricalBillHours);
    };

    setInterval(handleSave, 3600000);
  });

  useEffect(() => {
    const handleSaveHasil = async () => {
      await SaveHasil(withoutsBooster, avgCurrents);
    };

    setInterval(handleSaveHasil, 3600000);
  });

  return (
    <div>
      {noDataAlert && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          ⚠️ 303 Booster Off
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="grid grid-rows-2 gap-4 p-4">
          <Card className="bg-muted text-natural-content p-4 rounded-lg">
            <CardHeader>Without Booster</CardHeader>
            <CardContent>{withoutBooster} A </CardContent>
            <div>
              <p>Persen Kenaikan (15%/1.15 - 30%/1.30) : </p>
              <input
                type="number"
                value={persenadd}
                onChange={handlePersenAdd}
                placeholder="Enter Value"
                className="mb-1 p-1 border rounded w-1/2"
                step="0.01"
              />
            </div>
          </Card>
          <Card className="bg-muted text-natural-content p-4 rounded-lg">
            <CardHeader>With Booster</CardHeader>
            <CardContent>{withBooster} A</CardContent>
          </Card>
          <Card className="bg-muted text-natural-content p-4 rounded-lg">
            <CardHeader>Monthly Energy Usage ({currentMonth})</CardHeader>
            <CardContent>{monthlyEnergy} kWh</CardContent>
          </Card>
        </div>

        <div className="grid grid-rows-2 gap-4 p-4">
          <div className="grid grid-cols-3 gap-4 p-4">
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Voltage R</CardHeader>
              <CardContent>
                {voltageR !== null ? `${voltageR.toFixed(2)} V` : "No data"}
              </CardContent>
            </Card>
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Voltage S</CardHeader>
              <CardContent>
                {voltageS !== null ? `${voltageS.toFixed(2)} V` : "No data"}
              </CardContent>
            </Card>
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Voltage T</CardHeader>
              <CardContent>
                {voltageT !== null ? `${voltageT.toFixed(2)} V` : "No data"}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4">
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Current R</CardHeader>
              <CardContent className="text-center">
                {currentR !== null ? `${currentR.toFixed(1)} A` : "No data"}
                <p className="text-center">+</p>
                <div>
                  <p>Kalibrasi :</p>
                  <input
                    type="number"
                    value={inputKalibrasiR}
                    onChange={handleInputKalibrasiR}
                    placeholder="Enter Value"
                    className="mb-1 p-1 border rounded w-1/2"
                  />
                </div>

                <p className="text-center">+</p>
                <p>Pembagi Ampere :</p>
                <input
                  type="number"
                  value={inputValue1}
                  onChange={handleInputChangeS}
                  placeholder="Enter Value"
                  className="mb-1 p-1 border rounded w-1/2"
                  step="0.01"
                />
              </CardContent>
              <p className="text-center">Total : {aftercurrentR.toFixed(2)}</p>
            </Card>
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Current S</CardHeader>
              <CardContent className="text-center">
                {currentS !== null ? `${currentS.toFixed(1)} A` : "No data"}
                <p className="text-center">+</p>
                <p>Kalibrasi :</p>
                <input
                  type="number"
                  value={inputKalibrasiS}
                  onChange={handleInputKalibrasiS}
                  placeholder="Enter Value"
                  className="mb-1 p-1 border rounded w-1/2"
                />
                <p className="text-center">+</p>
                <p>Pembagi Ampere :</p>
                <input
                  type="number"
                  value={inputValue1}
                  onChange={handleInputChangeS}
                  placeholder="Enter Value"
                  className="mb-1 p-1 border rounded w-1/2"
                  step="0.01"
                />
              </CardContent>
              <p className="text-center">Total : {aftercurrentS.toFixed(2)}</p>
            </Card>
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Current T</CardHeader>
              <CardContent className="text-center">
                {currentT !== null ? `${currentT.toFixed(1)} A` : "No data"}
                <p className="text-center">+</p>
                <p>Kalibrasi :</p>
                <input
                  type="number"
                  value={inputKalibrasiT}
                  onChange={handleInputKalibrasiT}
                  placeholder="Enter Value"
                  className="mb-1 p-1 border rounded w-1/2"
                />
                <p className="text-center">+</p>
                <p>Pembagi Ampere :</p>
                <input
                  type="number"
                  value={inputValue1}
                  onChange={handleInputChangeS}
                  placeholder="Enter Value"
                  className="mb-1 p-1 border rounded w-1/2"
                  step="0.01"
                />
              </CardContent>
              <p className="text-center">Total : {aftercurrentT.toFixed(2)}</p>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4">
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Current Time</CardHeader>
              <CardContent>{realTime}</CardContent>
            </Card>
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Total Energy</CardHeader>
              <CardContent>
                {totalEnergy !== null
                  ? `${totalEnergy.toFixed(2)} kWh`
                  : "No data"}
              </CardContent>
            </Card>
            <Card className="bg-muted text-natural-content p-4 rounded-lg">
              <CardHeader>Electrical Bill Per Hour</CardHeader>
              <CardContent>
                {electricalBillHours !== null
                  ? `IDR ${formatCurrency(electricalBillHours)}`
                  : "No data"}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MQTTData;
