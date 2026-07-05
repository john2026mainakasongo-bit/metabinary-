import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const contracts = [
  "Even/Odd",
  "Matches/Differs",
  "Over/Under",
  "Rise/Fall",
  "Touch/No Touch",
];

const choicesByContract = {
  "Even/Odd": ["Even", "Odd"],
  "Matches/Differs": ["Matches", "Differs"],
  "Over/Under": ["Over", "Under"],
  "Rise/Fall": ["Rise", "Fall"],
  "Touch/No Touch": ["Touch", "No Touch"],
};

export default function App() {
  const [screen, setScreen] = useState(
    localStorage.getItem("token") ? "app" : "login"
  );

  const [mode, setMode] = useState(localStorage.getItem("mode") || "Demo");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState({ demo: 10000, real: 0 });

  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState(1);

  const [lastDigit, setLastDigit] = useState(8);
  const [previousDigit, setPreviousDigit] = useState(8);
  const [selectedDigit, setSelectedDigit] = useState(8);

  const [contractType, setContractType] = useState("Even/Odd");
  const [choice, setChoice] = useState("Even");

  const [openTrades, setOpenTrades] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);

  const [depositOpen, setDepositOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [depositAmount, setDepositAmount] = useState(10);

  const currentBalance = mode === "Demo" ? balance.demo : balance.real;

  const price = useMemo(() => {
    return (819 + lastDigit / 10 + Math.random() * 0.15).toFixed(2);
  }, [lastDigit]);

  const points = useMemo(() => {
    return Array.from({ length: 95 }, (_, i) => {
      const x = 40 + i * 10;
      const y =
        250 +
        Math.sin(i * 0.18) * 95 +
        Math.sin(i * 0.47) * 45 +
        Math.random() * 18;

      return `${x},${y}`;
    }).join(" ");
  }, [lastDigit]);

  function changeContract(type) {
    setContractType(type);
    setChoice(choicesByContract[type][0]);
  }

  function checkWin(type, selectedChoice, targetDigit, startDigit, finalDigit) {
    if (type === "Even/Odd") {
      return selectedChoice === "Even"
        ? finalDigit % 2 === 0
        : finalDigit % 2 !== 0;
    }

    if (type === "Matches/Differs") {
      return selectedChoice === "Matches"
        ? finalDigit === targetDigit
        : finalDigit !== targetDigit;
    }

    if (type === "Over/Under") {
      return selectedChoice === "Over"
        ? finalDigit > targetDigit
        : finalDigit < targetDigit;
    }

    if (type === "Rise/Fall") {
      return selectedChoice === "Rise"
        ? finalDigit > startDigit
        : finalDigit < startDigit;
    }

    if (type === "Touch/No Touch") {
      return selectedChoice === "Touch"
        ? finalDigit === targetDigit
        : finalDigit !== targetDigit;
    }

    return false;
  }

  async function refreshBalance() {
    if (!email) return;

    try {
      const res = await fetch(`${API}/api/user/${email}`);
      const data = await res.json();

      if (data.success) {
        setBalance({
          demo: Number(data.user.demoBalance || 10000),
          real: Number(data.user.realBalance || 0),
        });
      }
    } catch {
      console.log("Backend not reachable");
    }
  }

  useEffect(() => {
    if (screen === "app") refreshBalance();

    const timer = setInterval(() => {
      const d = Math.floor(Math.random() * 10);
      setPreviousDigit(lastDigit);
      setLastDigit(d);
      setSelectedDigit(d);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, email, lastDigit]);

  useEffect(() => {
    if (screen !== "app") return;

    const timer = setInterval(refreshBalance, 3000);
    return () => clearInterval(timer);
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
      localStorage.setItem("mode", "Demo");

      setEmail(data.user.email);
      setMode("Demo");

      setBalance({
        demo: Number(data.user.demoBalance || 10000),
        real: Number(data.user.realBalance || 0),
      });

      setScreen("app");
    } catch {
      alert("Backend is not connected. Start backend or set VITE_API_URL on Vercel.");
    }
  }

  function logout() {
    localStorage.clear();
    setScreen("login");
    setPassword("");
  }

  function changeMode(value) {
    setMode(value);
    localStorage.setItem("mode", value);
  }

  function trade() {
    const amount = Number(stake);
    const seconds = Number(duration);

    if (amount <= 0) return alert("Enter stake");
    if (seconds <= 0) return alert("Enter duration");
    if (currentBalance < amount) return alert("Insufficient balance");

    const tradeId = Date.now();
    const targetDigit = selectedDigit;
    const startDigit = previousDigit;

    const tradeData = {
      id: tradeId,
      contractType,
      choice,
      stake: amount,
      target: targetDigit,
      startDigit,
      duration: seconds,
      mode,
      status: "Running",
    };

    setOpenTrades((x) => [tradeData, ...x]);

    setBalance((b) =>
      mode === "Demo"
        ? { ...b, demo: b.demo - amount }
        : { ...b, real: b.real - amount }
    );

    setTimeout(() => {
      const finalDigit = Math.floor(Math.random() * 10);

      setPreviousDigit(lastDigit);
      setLastDigit(finalDigit);
      setSelectedDigit(finalDigit);

      const win = checkWin(
        contractType,
        choice,
        targetDigit,
        startDigit,
        finalDigit
      );

      const payout = win ? amount * 1.9 : 0;

      setOpenTrades((x) => x.filter((t) => t.id !== tradeId));

      setClosedTrades((x) => [
        {
          ...tradeData,
          result: finalDigit,
          win,
          payout,
        },
        ...x,
      ]);

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
    if (!phone || !depositAmount) {
      alert("Enter phone and amount");
      return;
    }

    try {
      const res = await fetch(`${API}/api/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          amount: Number(depositAmount),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Deposit failed");
        return;
      }

      alert("Deposit added. Real balance updated.");
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

          <p>
            {screen === "login"
              ? "Login to continue trading"
              : "Create your trading account"}
          </p>

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

          <button type="button" onClick={() => auth(screen)}>
            {screen === "login" ? "Login" : "Register"}
          </button>

          <span
            onClick={() =>
              setScreen(screen === "login" ? "register" : "login")
            }
          >
            {screen === "login"
              ? "Create account"
              : "Already have account? Login"}
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
          <button type="button">Trader&apos;s Hub</button>

          <button type="button" onClick={() => setDepositOpen(true)}>
            Deposit
          </button>

          <button type="button" onClick={() => alert("Withdraw coming soon")}>
            Withdraw
          </button>

          <button type="button">History</button>
          <button type="button">Chat</button>

          <button type="button" onClick={logout}>
            Logout
          </button>
        </nav>

        <div className="accountBox">
          <select value={mode} onChange={(e) => changeMode(e.target.value)}>
            <option>Demo</option>
            <option>Real</option>
          </select>

          <div className="balance">${currentBalance.toFixed(2)}</div>

          <button
            type="button"
            className="depositBtn"
            onClick={() => setDepositOpen(true)}
          >
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
                  <b>{t.contractType}</b>
                  <span>
                    {t.choice} • {t.mode} • ${t.stake}
                  </span>
                  <small>Target digit {t.target}</small>
                </div>
              ))
            )}

            {closedTrades.slice(0, 5).map((t) => (
              <div
                className={`tradeCard ${t.win ? "win" : "loss"}`}
                key={`closed-${t.id}`}
              >
                <b>
                  {t.win ? "WIN" : "LOSS"} • {t.choice}
                </b>

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
                <h1>Volatility 100 (1s) Index</h1>
                <p>{price} - 0.02 (0.00%)</p>
              </div>
            </div>

            <div className="chart">
              <svg viewBox="0 0 1000 450" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#333333" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#333333" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <polyline
                  points={`40,450 ${points} 970,450`}
                  fill="url(#areaFill)"
                  stroke="none"
                />

                <polyline
                  points={points}
                  fill="none"
                  stroke="#333333"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="priceTag">{price}</div>
            </div>

            <div className="digits">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setSelectedDigit(d)}
                  className={`digit ${selectedDigit === d ? "selected" : ""}`}
                >
                  <b>{d}</b>
                  <span>{(8 + Math.random() * 5).toFixed(1)}%</span>
                </button>
              ))}
            </div>
          </section>
        </main>

        <aside className="tradePanel">
          <p className="learn">ⓘ Learn about this trade type</p>

          <h1 className="tradeTitle">{contractType}</h1>

          <div className="contractTabs">
            {contracts.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => changeContract(item)}
                className={contractType === item ? "active" : ""}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="tradeMode">
            <span>Trade Mode</span>
            <b>Manual</b>
          </div>

          <div className="choice">
            {choicesByContract[contractType].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setChoice(item)}
                className={choice === item ? "green activeChoice" : "white"}
              >
                {item}
              </button>
            ))}
          </div>

          <label>Duration ticks</label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <label>Stake</label>
          <input value={stake} onChange={(e) => setStake(e.target.value)} />

          <button type="button" className="buyEven" onClick={trade}>
            Buy {choice}
            <span>Payout {(Number(stake) * 1.9).toFixed(2)} USD</span>
          </button>
        </aside>
      </div>

      {depositOpen && (
        <div className="modal">
          <div className="modalBox">
            <button
              type="button"
              className="x"
              onClick={() => setDepositOpen(false)}
            >
              ×
            </button>

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

            <button type="button" onClick={deposit}>
              Send STK Push
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
