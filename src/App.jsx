import { useState } from "react";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("login");

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="logo">MetaBinary</div>
        <p className="subtitle">
          {mode === "login"
            ? "Welcome back. Sign in to continue trading."
            : "Create your trading account."}
        </p>

        {mode === "register" && <input placeholder="Full name" />}

        <input placeholder="Email address" type="email" />
        <input placeholder="Password" type="password" />

        {mode === "login" && (
          <div className="authRow">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span>Forgot password?</span>
          </div>
        )}

        <button className="primaryBtn">
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        <p className="switchText">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
