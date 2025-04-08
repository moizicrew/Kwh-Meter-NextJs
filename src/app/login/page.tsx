// pages/login.tsx
"use client";

import { useState } from "react";
import { Login } from "../server/action";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const login = await Login(username, password);
      if (login) {
        window.location.href = "/";
      } else {
        alert("Login gagal, periksa username dan password.");
      }
    } catch (error) {
      alert("Terjadi kesalahan: " + error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
