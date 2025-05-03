import { updateAkun } from "@/app/server/action";
// import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type FormakunProps = {
  isOpen: boolean;
  onClose: () => void;
  account?: {
    id: string;
    email: string;
    role: string;
    name: string;
  } | null;
  //   onSave: (account: { id: number; email: string; role: string }) => void;
};

function FormEdit({ isOpen, onClose, account }: FormakunProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState<string>("");
  // const router = useRouter();

  useEffect(() => {
    if (account) {
      setEmail(account.email);
      setRole(account.role);
      setUsername(account.name);
      setId(account.id);
    } else {
      setEmail("");
      setRole("");
      setUsername("");
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAkun(id, email, role, username);
      // router.push("/akun");
      // console.log("SUccess Update");
      toast.success("Berhasil mengubah akun");
    } catch (error) {
      // console.log("Error Update Data: ", error
      toast.error(`Terjadi kesalahan dalam ${error} `);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">
          {account ? "Edit Akun" : "Tambah Akun"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Username</label>
            <input
              type="username"
              className="w-full border p-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Role</label>
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
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-400 px-4 py-2 rounded mr-2"
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
}

export default FormEdit;
