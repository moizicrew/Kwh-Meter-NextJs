"use client";

import { signInCredentials } from "@/lib/actions";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { LoginButtoon } from "../button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FormLogin = () => {
  const [state, formAction] = useFormState(signInCredentials, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success("Berhasil Sign In");

      setTimeout(async () => {
        await router.push("/");
        await router.refresh(); // aman karena redirect server-nya dimatikan
      }, 1500);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
        <div className="mt-1 text-sm text-gray-500">
          <span>{state?.error?.email}</span>
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
        <div className="mt-1 text-sm text-gray-500">
          <span>{state?.error?.password}</span>
        </div>
      </div>
      <LoginButtoon />
    </form>
  );
};

export default FormLogin;
