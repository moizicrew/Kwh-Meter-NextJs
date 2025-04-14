"use client";

import React, { useEffect, useState } from "react";
import Formakun from "./ui/formakun";
import { deleteAkun } from "@/app/server/action"; // Pastikan fungsi ini mengambil data dari database
import FormEdit from "./ui/formEdit";
import { User } from "@prisma/client";

type Account = {
  id: string;
  email: string | null;
  role: string;
  name: string | null;
};
function ManajemenAkun() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [users, setUsers] = useState<User[]>([]); // Inisialisasi dengan array kosong
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const handleEdit = (account: Account) => {
    setIsModalOpens(true);
    setSelectedAccount(account);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading users...</div>;

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
          // onSave={handleSave}
        />
      )}

      {isModalOpens && selectedAccount?.id && (
        <FormEdit
          isOpen={isModalOpens}
          onClose={() => setIsModalOpens(false)}
          account={{
            id: selectedAccount.id, // dijamin bukan null
            email: selectedAccount.email || "",
            role: selectedAccount.role,
            name: selectedAccount.name || "",
          }}
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
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-3 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-3">{user.email}</td>
                <td className="border border-gray-300 p-3 text-center">
                  {user.role}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {user.name}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteAkun(user.id)}
                  >
                    Hapus
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 mx-2 rounded"
                    onClick={() => handleEdit(user)}
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
