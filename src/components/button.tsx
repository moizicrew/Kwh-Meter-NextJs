"use client";

import { useFormStatus } from "react-dom";

export const LoginButtoon = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
    >
      {pending ? "Authenting.." : "Login"}
    </button>
  );
};
