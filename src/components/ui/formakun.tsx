import { saveDataAkun } from "@/app/server/action";
import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;

  onClose: () => void;
}

const Formakun: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState("");
  const [passwords, setPasswords] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const handleSave = async () => {
    await saveDataAkun(emails, passwords, username, role);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl text-black font-bold mb-4">Tambahkan Akun</h2>

        {/* Input Form */}
        <form onSubmit={handleSave}>
          <div className="mb-2">
            <label className="block text-black text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-black text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={passwords}
              onChange={(e) => setPasswords(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-black text-sm font-medium">
              Username
            </label>
            <input
              type="username"
              className="w-full border p-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-black font-medium">Role</label>
            <select
              className="w-full border p-2 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Batal
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formakun;
