"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./ToggleTheme";
import Image from "next/image";
import { Session } from "next-auth";

export const ClientHeader = ({ session }: { session: Session | null }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Berhasil logout");
      setTimeout(() => router.push("/login"), 1000);
    } catch (error) {
      toast.error(`Gagal logout: ${error}`);
    }
  };

  return (
    <header className="header bg-natural text-natural-content flex justify-items-start place-content-around items-center mx-auto px-8 py-3 top-0 w-full z-50">
      <Image
        src="/AHC.svg"
        alt="AHC Logo"
        className="dark:invert p-2 gap-3 mr-8 flex-nowrap items-center justify-start"
        width={180}
        height={48}
        priority
      />
      <div className="flex h-14 font-bold mx-auto w-full items-center px-4 justify-between">
        <a className="text-xl text-natural-content">Energy Meter</a>
      </div>

      <nav className="flex h-14 mx-auto w-full items-center justify-between">
        <ul className="flex space-x-4">
          {session ? (
            <>
              <li>
                <Link href="/" className="text-xl hover:font-bold">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/profil" className="text-xl hover:font-bold">
                  Profil
                </Link>
              </li>
              {session.user?.role === "admin" ? (
                <>
                  <li>
                    <Link href="/akun" className="text-xl hover:font-bold">
                      Manajemen Akun
                    </Link>
                  </li>
                  <li>
                    <Link href="/laporan" className="text-xl hover:font-bold">
                      Laporan
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/laporan" className="text-xl hover:font-bold">
                    Laporan
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-xl hover:font-bold"
                >
                  SignOut
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="text-xl hover:font-bold">
                SignIn
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="ml-4">
        <ModeToggle />
      </div>
    </header>
  );
};
