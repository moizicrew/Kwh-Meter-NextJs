import FormLogin from "@/components/auth/form-login";
import React from "react";

const Login = () => {
  return (
    <div className="p-6 space-y-3  justify-center items-center">
      <h1 className="text-2xl text-center  font-bold text-gray-900">
        Login an Account
      </h1>
      <FormLogin />
    </div>
  );
};

export default Login;
