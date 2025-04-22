import { getHasil, getKwhPricesInRange } from "@/app/server/action";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import React, { useState } from "react";

type KwhPrice = {
  id: number;
  avgampere: number;
  avgvoltase: number;
  avg: number;
  kwh: number;
  biaya: number;
  saving: number;
  timestamp: Date;
};

function Laporans() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<KwhPrice[]>([]);
  const [withBooster, setWithBooster] = useState(0);
  const [withoutBooster, setWithoutBooster] = useState(0);

  const handleSearch = async () => {
    const result = await getKwhPricesInRange(startDate, endDate);
    const fetchData = async () => {
      const data: {
        totalNoBooster: number;
        totalBooster: number;
        count: number;
      } = await getHasil(startDate, endDate);

      setWithBooster(data.totalBooster);
      setWithoutBooster(data.totalNoBooster);
    };

    fetchData();
    setData(result);

    if (result.length > 0) {
      const totalAmpere = result.reduce((sum, item) => sum + item.avgampere, 0);
      const totalVoltase = result.reduce(
        (sum, item) => sum + item.avgvoltase,
        0
      );
      const totalKwh = result.reduce((sum, item) => sum + item.kwh, 0);

      setSummary({
        avgAmpere: totalAmpere / result.length,
        avgVoltase: totalVoltase / result.length,
        totalKwh: totalKwh,
      });
    } else {
      setSummary({
        avgAmpere: 0,
        avgVoltase: 0,
        totalKwh: 0,
      });
    }
  };

  const [summary, setSummary] = useState({
    avgAmpere: 0,
    avgVoltase: 0,
    totalKwh: 0,
  });

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header tengah
    doc.setFontSize(18);
    doc.text("KWH Meter", doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });
    doc.text("AHC MANUFACTURE", doc.internal.pageSize.getWidth() / 2, 23, {
      align: "center",
    });

    // Informasi tanggal
    doc.setFontSize(12);
    doc.text(`Tanggal: ${startDate} s.d. ${endDate}`, 14, 32);

    // Ringkasan data
    let y = 40;
    doc.setFontSize(12);
    doc.text("Ringkasan:", 14, y);
    doc.text(
      `- Rata-rata Ampere: ${summary.avgAmpere.toFixed(2)} A`,
      14,
      y + 6
    );
    doc.text(
      `- Rata-rata Voltase: ${summary.avgVoltase.toFixed(2)} V`,
      14,
      y + 12
    );
    doc.text(`- Total Kwh: ${summary.totalKwh.toFixed(2)} kWh`, 14, y + 18);

    // Ringkasan Booster
    y += 30;
    doc.text("Ringkasan Booster:", 14, y);
    doc.text(`- Total Data With Booster: ${withBooster.toFixed(2)}`, 14, y + 6);
    doc.text(
      `- Total Data Without Booster: ${withoutBooster.toFixed(2)}`,
      14,
      y + 12
    );

    // Data tabel (start setelah ringkasan)
    const tableData = data.map((item) => [
      item.id,
      new Date(item.timestamp).toLocaleString(),
      item.avgampere,
      item.avgvoltase,
      item.kwh,
      item.biaya,
      `${item.saving} %`,
    ]);

    autoTable(doc, {
      startY: y + 20,
      head: [
        [
          "ID",
          "Tanggal",
          "Rata-rata Ampere",
          "Rata-rata Voltase",
          "Kwh",
          "Biaya",
          "Saving",
        ],
      ],
      body: tableData,
    });

    doc.save(`Laporan_Kwh_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Cari Data Kwh Berdasarkan Tanggal
      </h2>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="p-2 border rounded mr-2"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSearch}
      >
        Cari
      </button>

      <h1 className="text-center font-bold text-2xl"> KWH Meter</h1>
      <h1 className="text-center font-bold text-2xl"> AHC MANUFACTURE</h1>
      <div className="flex justify-between">
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Ringkasan</h3>
          <p>Rata-rata Ampere: {summary.avgAmpere.toFixed(2)} A</p>
          <p>Rata-rata Voltase: {summary.avgVoltase.toFixed(2)} V</p>
          <p>Total Kwh: {summary.totalKwh.toFixed(2)} kWh</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Ringkasan Booster</h3>
          <p>Total Data With Booster: {withBooster.toFixed(2)}</p>
          <p>Total Data Without Booster: {withoutBooster.toFixed(2)}</p>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Rata-rata Ampere</th>
            <th className="border p-2">Rata-rata Voltase</th>
            <th className="border p-2">Kwh</th>
            <th className="border p-2">Biaya</th>
            <th className="border p-2">Estimasi Saving</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">
                {new Date(item.timestamp).toLocaleString()}
              </td>
              <td className="border p-2">{item.avgampere}</td>
              <td className="border p-2">{item.avgvoltase}</td>
              <td className="border p-2">{item.kwh}</td>
              <td className="border p-2">{item.biaya}</td>
              <td className="border p-2">{item.saving} %</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="bg-green-500 m-2 text-white px-3 py-1 rounded"
        onClick={downloadPDF}
      >
        Download PDF
      </button>
    </div>
  );
}

export default Laporans;
