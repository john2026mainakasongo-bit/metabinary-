import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [screen, setScreen] = useState(localStorage.getItem("token") ? "app" : "login");
  const [mode, setMode] = useState("Real");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState({ demo: 10000, real: 0 });
  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState(5);
  const [lastDigit, setLastDigit] = useState(8);
  const [selectedDigit, setSelectedDigit] = useState(8);
  const [choice, setChoice] = useState("Even");
  const [openTrades, setOpenTrades] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);
  const [depositOpen, setDepositOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [depositAmount, setDepositAmount] = useState(10);

  const currentBalance = mode === "Demo" ? balance.demo : balance.real;

  const points = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => {
      const x = i * 12;
      const y = 185 + Math.sin(i * 1.7) * 35 + Math.random() * 50;
      return `${x},${y}`;
    }).join(" ");
  }, [lastDigit]);

  async function refreshBalance() {
    if (!email) return;

    try {
      const res = await fetch(`${API}/api/user/${email}`);
      const data = await res.json();

      if (data.success) {
        setBalance({
          demo: Number(data.user.demoBalance || 0),
          real: Number(data.user.realBalance || 0),
        });
      }
    } catch {
      console.log("Backend not reachable");
    }
  }

  useEffect(() => {
    if (screen === "app") refreshBalance();

    const t = setInterval(() => {
      const d = Math.floor(Math.random() * 10);
      setLastDigit(d);
      setSelectedDigit(d);
    }, 1000);

    return () => clearInterval(t);
  }, [screen, email]);

  useEffect(() => {
    if (screen !== "app") return;
    const t = setInterval(refreshBalance, 3000);
    return () => clearInterval(t);
  }, [screen, email]);

  async function auth(type) {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await fetch(`${API}/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Auth failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.user.email);

      setEmail(data.user.email);
      setBalance({
        demo: Number(data.user.demoBalance || 10000),
        real: Number(data.user.realBalance || 0),
      });

      setScreen("app");
    } catch (error) {
      alert("Backend is not connected. Start backend or set VITE_API_URL on Vercel.");
    }
  }

  function logout() {
    localStorage.clear();
    setScreen("login");
    setPassword("");
  }

  function trade() {
    const amount = Number(stake);
    const seconds = Number(duration);

    if (amount <= 0) return alert("Enter stake");
    if (seconds <= 0) return alert("Enter duration");
    if (currentBalance < amount) return alert("Insufficient balance");

    const tradeId = Date.now();
    const startDigit = selectedDigit;

    const trade = {
      id: tradeId,
      choice,
      stake: amount,
      target: startDigit,
      duration: seconds,
      mode,
      status: "Running",
    };

    setOpenTrades((x) => [trade, ...x]);

    setBalance((b) =>
      mode === "Demo"
        ? { ...b, demo: b.demo - amount }
        : { ...b, real: b.real - amount }
    );

    setTimeout(() => {
      const finalDigit = Math.floor(Math.random() * 10);
      setLastDigit(finalDigit);
      setSelectedDigit(finalDigit);

      const win = choice === "Even" ? finalDigit % 2 === 0 : finalDigit % 2 !== 0;
      const payout = win ? amount * 1.9 : 0;

      setOpenTrades((x) => x.filter((t) => t.id !== tradeId));
      setClosedTrades((x) => [{ ...trade, result: finalDigit, win, payout }, ...x]);

      if (win) {
        setBalance((b) =>
          mode === "Demo"
            ? { ...b, demo: b.demo + payout }
            : { ...b, real: b.real + payout }
        );
      }
    }, seconds * 1000);
  }

  async function deposit() {
    if (!phone || !depositAmount) return alert("Enter phone and amount");

    try {
      const res = await fetch(`${API}/api/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, amount: Number(depositAmount) }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Deposit failed");
        return;
      }

      alert("STK Push sent. Enter your M-Pesa PIN.");
      refreshBalance();
    } catch {
      alert("Deposit failed. Backend is not connected.");
    }
  }

  if (screen === "login" || screen === "register") {
    return (
      <div className="authPage">
        <div className="authCard">
          <h1>MetaBinary</h1>
          <p>{screen === "login" ? "Login to continue trading" : "Create your trading account"}</p>

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

          <button onClick={() => auth(screen)}>
            {screen === "login" ? "Login" : "Register"}
          </button>

          <span onClick={() => setScreen(screen === "login" ? "register" : "login")}>
            {screen === "login" ? "Create account" : "Already have account? Login"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="platform">
      <header className="topbar">
        <div className="brand">MetaBinary</div>

        <nav className="nav">
          <button>Trader&apos;s Hub</button>
          <button onClick={() => setDepositOpen(true)}>Deposit</button>
          <button>alert Withdraw coming soon</button>
          <button>History</button>
          <button>Chat</button>
          <button onClick={logout}>Logout</button>
        </nav>

        <div className="accountBox">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option>Real</option>
            <option>Demo</option>
          </select>

          <div className="balance">${currentBalance.toFixed(2)}</div>

          <button className="depositBtn" onClick={() => setDepositOpen(true)}>
            Deposit
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="leftPanel">
          <div className="tabs">
            <span className="active">Open ({openTrades.length})</span>
            <span>Closed ({closedTrades.length})</span>
          </div>

          <div className="positions">
            {openTrades.length === 0 ? (
              <>
                <div className="avatar">MB</div>
                <h2>No open positions</h2>
                <p>Your MetaBinary trades will appear here</p>
              </>
            ) : (
              openTrades.map((t) => (
                <div className="tradeCard" key={t.id}>
                  <b>{t.choice}</b>
                  <span>{t.mode} • ${t.stake}</span>
                  <small>Target {t.target}</small>
                </div>
              ))
            )}

            {closedTrades.slice(0, 5).map((t) => (
              <div className={`tradeCard ${t.win ? "win" : "loss"}`} key={`closed-${t.id}`}>
                <b>{t.win ? "WIN" : "LOSS"} • {t.choice}</b>
                <span>Result digit: {t.result}</span>
                <small>Payout ${t.payout.toFixed(2)}</small>
              </div>
            ))}
          </div>
        </aside>

        <main className="chartWrap">
          <section className="chartCard">
            <div className="chartHeader">
              <div>
                <h1>Volatility 100 (1s)</h1>
                <p>Live Synthetic Market</p>
              </div>

              <div className="lastDigit">{lastDigit}</div>
            </div>

            <div className="chart">
              <svg viewBox="0 0 950 390" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="95" height="55" patternUnits="userSpaceOnUse">
                    <path d="M95 0 L0 0 0 55" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                  </pattern>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                <polyline
                  points={points}
                  fill="none"
                  stroke="#edf3ff"
                  strokeWidth="4"
                  filter="url(#glow)"
                />
              </svg>
            </div>

            <div className="digits">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDigit(d)}
                  className={`digit ${selectedDigit === d ? "selected" : ""}`}
                >
                  <b>{d}</b>
                  <span>{(12 + Math.random()).toFixed(1)}%</span>
                </button>
              ))}
            </div>
          </section>
        </main>

        <aside className="tradePanel">
          <p className="learn">ⓘ Learn about this trade type</p>

          <h1 className="tradeTitle">Even/Odd</h1>

          <div className="contractTabs">
            {["Even/Odd", "Matches/Differs", "Over/Under", "Rise/Fall", "Touch/No Touch"].map((x) => (
              <button className={x === "Even/Odd" ? "active" : ""} key={x}>
                {x}
              </button>
            ))}
          </div>

          <div className="tradeMode">
            <span>Trade Mode</span>
            <b>Manual</b>
          </div>

          <div className="choice">
            <button onClick={() => setChoice("Even")} className={choice === "Even" ? "green" : "white"}>
              Even
            </button>

            <button onClick={() => setChoice("Odd")} className={choice === "Odd" ? "green" : "white"}>
              Odd
            </button>
          </div>

          <label>Duration ticks</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} />

          <label>Stake</label>
          <input value={stake} onChange={(e) => setStake(e.target.value)} />

          <button className="buyEven" onClick={trade}>
            Buy {choice}
            <span>Payout {(Number(stake) * 1.9).toFixed(2)} USD</span>
          </button>
        </aside>
      </div>

      {depositOpen && (
        <div className="modal">
          <div className="modalBox">
            <button className="x" onClick={() => setDepositOpen(false)}>×</button>

            <h2>Deposit</h2>
            <p>Send M-Pesa STK Push</p>

            <input
              placeholder="2547XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />

            <button onClick={deposit}>Send STK Push</button>
          </div>
        </div>
      )}
    </div>
  );
}
