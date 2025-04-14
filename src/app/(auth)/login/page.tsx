import FormLogin from "@/components/auth/form-login";
import React from "react";

const Login = () => {
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
      <FormLogin />
    </div>
  );
};

export default Login;
