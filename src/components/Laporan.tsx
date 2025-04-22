import { getKwhPricesInRange } from "@/app/server/action";
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

  const handleSearch = async () => {
    const result = await getKwhPricesInRange(startDate, endDate);
    setData(result);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Laporan Data Kwh", 14, 15);
    doc.setFontSize(12);
    doc.text(`Tanggal: ${startDate} s.d. ${endDate}`, 14, 22);

    const tableData = data.map((item) => [
      item.id,
      item.avgampere,
      item.avgvoltase,
      item.avg,
      item.kwh,
      item.biaya,
      `${item.saving} %`,
      new Date(item.timestamp).toLocaleString(),
    ]);

    // doc.autoTable({
    //   startY: 30,
    //   head: [["ID", "Avg", "Kwh", "Biaya", "Tanggal"]],
    //   body: tableData,
    // });

    autoTable(doc, {
      head: [["ID", "Avg", "Kwh", "Biaya", "Tanggal"]],
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
