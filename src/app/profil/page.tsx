import { auth } from "@/auth"; // Pastikan ini sesuai struktur proyekmu
import React from "react";

export default async function Profil() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="p-4 text-center text-red-500">Anda belum login.</div>
    );
  }

  const { name, role } = session.user;

  return (
    <div className="p-8 max-w-2xl mx-auto  rounded-xl shadow-md   h-screen space-y-6">
      <h1 className="text-3xl font-bold text-center text-primary">
        Profil Akun
      </h1>
      <div className="my-3 flex justify-between">
        <div className="text-xl">
          <span className="font-semibold">Nama:</span> {name}
        </div>
        <div className="text-xl">
          <span className="font-semibold">Peran:</span> {role}
        </div>
        <div className="text-xl">
          <span className="font-semibold">Model Booster:</span> {"Belum diset"}
        </div>
      </div>
    </div>
  );
}
