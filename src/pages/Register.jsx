import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register({ goLogin, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Register failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onRegister(data.user);
    } catch (error) {
      alert("Backend is not connected");
    }
  }

  return (
    <div className="authPage">
      <div className="authBox">
        <h1>MetaBinary</h1>
        <h2>Create Account</h2>

        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={register}>
          Register
        </button>

        <p onClick={goLogin}>Already have an account?</p>
      </div>
    </div>
  );
}
