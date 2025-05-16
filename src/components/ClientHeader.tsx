"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./ToggleTheme";
import Image from "next/image";
import { Session } from "next-auth";
import { useState } from "react";


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

  const [showMenu, setShowMenu] = useState(false);


  return (
    <header className="bg-natural text-natural-content w-full top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-3 md:flex-nowrap">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/AHC.svg"
            alt="AHC Logo"
            className="dark:invert p-2"
            width={150}
            height={40}
            priority
          />
          <span className="text-xl font-bold ml-4">Energy Meter</span>
        </div>

        {/* Toggle Button (Mobile) */}
        <div className="md:hidden">
          <button
            className="text-xl focus:outline-none"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰
          </button>
        </div>

      {/* Navigation */}
        <nav
          className={`w-full md:w-auto ${
            showMenu ? "block" : "hidden"
          } md:flex items-center mt-4 md:mt-0`}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-4">
            {session ? (
              <>
                <li>
                  <Link href="/" className="text-lg hover:font-bold">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/profil" className="text-lg hover:font-bold">
                    Profil
                  </Link>
                </li>
                {session.user?.role === "admin" ? (
                  <>
                    <li>
                      <Link href="/akun" className="text-lg hover:font-bold">
                        Manajemen Akun
                      </Link>
                    </li>
                    <li>
                      <Link href="/laporan" className="text-lg hover:font-bold">
                        Laporan
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link href="/laporan" className="text-lg hover:font-bold">
                      Laporan
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-lg hover:font-bold"
                  >
                    SignOut
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="text-lg hover:font-bold">
                  SignIn
                </Link>
              </li>
            )}
          </ul>
        </nav>
          
        {/* Dark Mode Toggle */}
        <div className="hidden md:block ml-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
