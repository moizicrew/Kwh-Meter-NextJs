"use client";

import { signUpCredentials } from "@/lib/actions";
import React from "react";
import { useFormState } from "react-dom";

const FormRegister = () => {
  const [state, formAction] = useFormState(signUpCredentials, null);

  return (
    <form
      action={formAction}
      className="mx-auto p-6 my-3 bg-white border border-gray-200 rounded-lg shadow-md"
    >
      {state?.message ? (
        <div>
          <span className="text-black">{state?.message}</span>
        </div>
      ) : null}

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nama
        </label>
        <input
          type="text"
          name="name"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
        <div className="mt-1 text-sm text-gray-500">
          <span>{state?.error?.name}</span>
        </div>
      </div>
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
      <div className="mb-4">
        <label
          htmlFor="ConfirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Konfirmasi Password
        </label>
        <input
          type="password"
          name="ConfirmPassword"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
        <div className="mt-1 text-sm text-gray-500">
          <span>{state?.error?.ConfirmPassword}</span>
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Daftar
      </button>
    </form>
  );
};

export default FormRegister;
