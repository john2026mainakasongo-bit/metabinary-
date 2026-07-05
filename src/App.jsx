import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import ChartArea from "./components/ChartArea";
import TradePanel from "./components/TradePanel";
import AIAssistant from "./components/AIAssistant";

import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("login");

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [account, setAccount] = useState(
    localStorage.getItem("account") || "demo"
  );

  if (!token) {
    return screen === "login" ? (
      <Login goRegister={() => setScreen("register")} />
    ) : (
      <Register goLogin={() => setScreen("login")} />
    );
  }

  const balance =
    account === "demo"
      ? user.demoBalance || 10000
      : user.realBalance || 0;

  return (
    <div className="app">
      <Topbar
        balance={balance}
        account={account}
        setAccount={setAccount}
      />

      <div className="mainLayout">
        <Sidebar />

        <ChartArea />

        <TradePanel account={account} balance={balance} />

        <AIAssistant />
      </div>
    </div>
  );
}
