"use client";

import React, { useEffect, useState } from "react";
import Formakun from "./ui/formakun";
import { deleteAkun, getAkun } from "@/app/server/action"; // Pastikan fungsi ini mengambil data dari database
import FormEdit from "./ui/formEdit";

type Account = {
  id: number; // ✅ Ubah dari string ke number
  email: string;
  role: string;
  username: string;
};

function ManajemenAkun() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]); // Tipe data diperjelas
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleEdit = (account: Account) => {
    setIsModalOpens(true);
    setSelectedAccount(account);
  };

  useEffect(() => {
    const fetchAkun = async () => {
      try {
        const data = await getAkun(); // ✅ Pastikan fungsi mengembalikan data
        if (Array.isArray(data)) {
          setAccounts(data); // ✅ Set state hanya jika data berupa array
        } else {
          console.error("Data yang diterima bukan array:", data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchAkun();
  }, []);

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
        Manajemen Akun
      </h1>

      <button
        className="w-1/3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition shadow-md mb-6"
        onClick={() => setIsModalOpen(true)}
      >
        Tambahkan Akun
      </button>

      {isModalOpen && (
        <Formakun
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          account={selectedAccount}
          // onSave={handleSave}
        />
      )}

      {isModalOpens && (
        <FormEdit
          isOpen={isModalOpens}
          onClose={() => setIsModalOpens(false)}
          account={selectedAccount}
          // onSave={handleSave}
        />
      )}

      <div className="w-full max-w-4xl overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse border border-gray-300 text-gray-800">
          <thead>
            <tr className="bg-blue-500 text-white text-left">
              <th className="border border-gray-300 p-3">No</th>
              <th className="border border-gray-300 p-3">Email</th>
              <th className="border border-gray-300 p-3">Role</th>
              <th className="border border-gray-300 p-3">Username</th>
              <th className="border border-gray-300 p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={account.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-3 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-3">{account.email}</td>
                <td className="border border-gray-300 p-3 text-center">
                  {account.role}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {account.username}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteAkun(account.id)}
                  >
                    Hapus
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 mx-2 rounded"
                    onClick={() => handleEdit(account)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManajemenAkun;
