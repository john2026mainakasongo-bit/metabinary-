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
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token"));
  const [account, setAccount] = useState("demo");
  const [demoBalance, setDemoBalance] = useState(10000);
  const [realBalance, setRealBalance] = useState(0);

  const balance = account === "demo" ? demoBalance : realBalance;

  if (!loggedIn) {
    return screen === "login" ? (
      <Login
        goRegister={() => setScreen("register")}
        onLogin={() => setLoggedIn(true)}
      />
    ) : (
      <Register
        goLogin={() => setScreen("login")}
        onRegister={() => setLoggedIn(true)}
      />
    );
  }

  return (
    <div className="app">
      <Topbar
        balance={balance}
        account={account}
        setAccount={setAccount}
        logout={() => {
          localStorage.removeItem("token");
          setLoggedIn(false);
        }}
      />

      <div className="mainLayout">
        <Sidebar />
        <ChartArea />
        <TradePanel
          account={account}
          balance={balance}
          setDemoBalance={setDemoBalance}
          setRealBalance={setRealBalance}
        />
        <AIAssistant />
      </div>
    </div>
  );
}
