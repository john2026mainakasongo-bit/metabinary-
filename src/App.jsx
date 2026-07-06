import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const contracts = ["Rise/Fall", "Even/Odd", "Matches/Differs", "Over/Under", "Touch/No Touch"];

const choicesByContract = {
  "Rise/Fall": ["Rise", "Fall"],
  "Even/Odd": ["Even", "Odd"],
  "Matches/Differs": ["Matches", "Differs"],
  "Over/Under": ["Over", "Under"],
  "Touch/No Touch": ["Touch", "No Touch"],
};

function createChartData() {
  let y = 255;
  return Array.from({ length: 95 }, (_, i) => {
    y += (Math.random() - 0.48) * 28;
    if (y < 115) y = 115;
    if (y > 360) y = 360;
    return { x: 40 + i * 13, y };
  });
}

export default function App() {
  const [screen, setScreen] = useState(localStorage.getItem("token") ? "app" : "login");
  const [mode, setMode] = useState(localStorage.getItem("mode") || "Demo");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState({ demo: 10000, real: 0 });

  const [mainTab, setMainTab] = useState("Trade");
  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState(5);
  const [botRuns, setBotRuns] = useState(3);

  const [previousDigit, setPreviousDigit] = useState(8);
  const [lastDigit, setLastDigit] = useState(8);
  const [selectedDigit, setSelectedDigit] = useState(8);

  const [contractType, setContractType] = useState("Rise/Fall");
  const [choice, setChoice] = useState("Rise");

  const [openTrades, setOpenTrades] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);

  const [depositOpen, setDepositOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [depositAmount, setDepositAmount] = useState(10);

  const [chartData, setChartData] = useState(createChartData);

  const currentBalance = mode === "Demo" ? balance.demo : balance.real;

  const price = useMemo(() => {
    return (819 + lastDigit / 10 + Math.random() * 0.15).toFixed(2);
  }, [lastDigit]);

  const points = useMemo(() => {
    return chartData.map((p) => `${p.x},${p.y.toFixed(1)}`).join(" ");
  }, [chartData]);

  const digitStats = useMemo(() => {
    return Array.from({ length: 10 }, (_, d) => ({
      d,
      percent: (8 + Math.random() * 4).toFixed(1),
    }));
  }, [lastDigit]);

  function changeContract(type) {
    setContractType(type);
    setChoice(choicesByContract[type][0]);
  }

  function checkWin(type, selectedChoice, targetDigit, startDigit, finalDigit) {
    if (type === "Even/Odd") return selectedChoice === "Even" ? finalDigit % 2 === 0 : finalDigit % 2 !== 0;
    if (type === "Matches/Differs") return selectedChoice === "Matches" ? finalDigit === targetDigit : finalDigit !== targetDigit;
    if (type === "Over/Under") return selectedChoice === "Over" ? finalDigit > targetDigit : finalDigit < targetDigit;
    if (type === "Rise/Fall") return selectedChoice === "Rise" ? finalDigit > startDigit : finalDigit < startDigit;
    if (type === "Touch/No Touch") return selectedChoice === "Touch" ? finalDigit === targetDigit : finalDigit !== targetDigit;
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

      setLastDigit((old) => {
        setPreviousDigit(old);
        return d;
      });

      setSelectedDigit(d);

      setChartData((old) => {
        const lastY = old[old.length - 1]?.y || 250;
        let nextY = lastY + (Math.random() - 0.48) * 32;

        if (nextY < 115) nextY = 115;
        if (nextY > 360) nextY = 360;

        const next = old.slice(1).map((p, i) => ({
          x: 40 + i * 13,
          y: p.y,
        }));

        next.push({
          x: 40 + (old.length - 1) * 13,
          y: nextY,
        });

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, email]);

  useEffect(() => {
    if (screen !== "app") return;
    const timer = setInterval(refreshBalance, 3000);
    return () => clearInterval(timer);
  }, [screen, email]);

  async function auth(type) {
    if (!email || !password) return alert("Enter email and password");

    try {
      const res = await fetch(`${API}/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) return alert(data.message || "Auth failed");

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
      alert("Backend is not connected. Start backend or set VITE_API_URL.");
    }
  }

  function logout() {
    localStorage.clear();
    setScreen("login");
    setPassword("");
    setMenuOpen(false);
  }

  function changeMode(value) {
    setMode(value);
    localStorage.setItem("mode", value);
  }

  function trade(custom = {}) {
    const amount = Number(custom.stake ?? stake);
    const seconds = Number(custom.duration ?? duration);
    const type = custom.contractType ?? contractType;
    const selectedChoice = custom.choice ?? choice;

    if (amount <= 0) return alert("Enter stake");
    if (seconds <= 0) return alert("Enter duration");
    if (currentBalance < amount) return alert("Insufficient balance");

    const tradeId = Date.now() + Math.random();
    const targetDigit = selectedDigit;
    const startDigit = previousDigit;

    const tradeData = {
      id: tradeId,
      contractType: type,
      choice: selectedChoice,
      stake: amount,
      target: targetDigit,
      startDigit,
      duration: seconds,
      mode,
      status: "Running",
    };

    setOpenTrades((x) => [tradeData, ...x]);

    setBalance((b) =>
      mode === "Demo" ? { ...b, demo: b.demo - amount } : { ...b, real: b.real - amount }
    );

    setTimeout(() => {
      const finalDigit = Math.floor(Math.random() * 10);

      setPreviousDigit(lastDigit);
      setLastDigit(finalDigit);
      setSelectedDigit(finalDigit);

      const win = checkWin(type, selectedChoice, targetDigit, startDigit, finalDigit);
      const payout = win ? amount * 1.9 : 0;

      setOpenTrades((x) => x.filter((t) => t.id !== tradeId));
      setClosedTrades((x) => [{ ...tradeData, result: finalDigit, win, payout }, ...x]);

      if (win) {
        setBalance((b) =>
          mode === "Demo" ? { ...b, demo: b.demo + payout } : { ...b, real: b.real + payout }
        );
      }
    }, seconds * 1000);
  }

  function runFreeBot() {
    const runs = Number(botRuns);
    if (runs <= 0) return alert("Enter bot runs");
    for (let i = 0; i < runs; i++) setTimeout(() => trade(), i * 1400);
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

      if (!data.success) return alert(data.message || "Deposit failed");

      alert("STK Push sent. Wait for M-Pesa confirmation.");
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

          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="button" onClick={() => auth(screen)}>
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
        <div className="topLine">
          <button type="button" className="topMenuBtn" onClick={() => setMenuOpen(true)}>
            ☰
          </button>

          <select className="topAccount" value={mode} onChange={(e) => changeMode(e.target.value)}>
            <option>Demo</option>
            <option>Real</option>
          </select>

          <div className="topBalance">${currentBalance.toFixed(2)}</div>
        </div>

        <div className="mainTabs">
          {["Trade", "Charts", "Free Bot", "Copy Trading"].map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setMainTab(tab)}
              className={mainTab === tab ? "active" : ""}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="layout">
        <aside className="leftPanel">
          <div className="tabs">
            <span className="active">Open ({openTrades.length})</span>
            <span>Closed ({closedTrades.length})</span>
          </div>

          <div className="positions">
            {openTrades.length === 0 && (
              <>
                <div className="avatar">MB</div>
                <h2>No open positions</h2>
                <p>Your MetaBinary trades will appear here</p>
              </>
            )}

            {openTrades.map((t) => (
              <div className="tradeCard" key={t.id}>
                <b>{t.contractType}</b>
                <span>
                  {t.choice} • {t.mode} • ${t.stake}
                </span>
                <small>Target digit {t.target}</small>
              </div>
            ))}

            {closedTrades.slice(0, 8).map((t) => (
              <div className={`tradeCard ${t.win ? "win" : "loss"}`} key={`closed-${t.id}`}>
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
              <svg viewBox="0 0 1300 450" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#12d6b3" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#12d6b3" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <polygon points={`40,430 ${points} 1260,430`} />

                <polyline
                  points={points}
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="priceTag">{price}</div>
            </div>

            <div className="digits">
              {digitStats.map(({ d, percent }) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setSelectedDigit(d)}
                  className={`digit ${selectedDigit === d ? "selected" : ""}`}
                >
                  <b>{d}</b>
                  <span>{percent}%</span>
                </button>
              ))}
            </div>
          </section>
        </main>

        <aside className="tradePanel">
          {mainTab === "Trade" && (
            <>
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

              <div className="tradeRow">
                <span>Duration</span>
                <b>{duration} ticks</b>
              </div>

              <input value={duration} onChange={(e) => setDuration(e.target.value)} />

              <div className="tradeRow">
                <span>Stake</span>
                <b>{stake} USD</b>
              </div>

              <input value={stake} onChange={(e) => setStake(e.target.value)} />

              <div className="choice">
                {choicesByContract[contractType].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setChoice(item)}
                    className={index === 0 ? "green" : "white"}
                  >
                    {item}
                    <small>Payout</small>
                    <strong>{(Number(stake) * (index === 0 ? 2.22 : 1.82)).toFixed(2)} USD</strong>
                  </button>
                ))}
              </div>

              <button type="button" className="buyEven" onClick={() => trade()}>
                Buy {choice}
                <span>{(Number(stake) * 1.9).toFixed(2)} USD payout</span>
              </button>
            </>
          )}

          {mainTab === "Charts" && (
            <div className="toolBox">
              <h2>Charts</h2>
              <p>Live synthetic movement is displayed in the market area.</p>
              <button type="button" className="mainBuy" onClick={() => setMainTab("Trade")}>
                Back to Trade
              </button>
            </div>
          )}

          {mainTab === "Free Bot" && (
            <div className="toolBox">
              <h2>Free Bot</h2>
              <p>Run automatic trades using your selected contract.</p>

              <label>Bot Runs</label>
              <input value={botRuns} onChange={(e) => setBotRuns(e.target.value)} />

              <button type="button" className="mainBuy" onClick={runFreeBot}>
                Start Free Bot
              </button>
            </div>
          )}

          {mainTab === "Copy Trading" && (
            <div className="toolBox">
              <h2>Copy Trading</h2>
              <p>Copy trading is coming soon on MetaBinary.</p>
              <button type="button" className="mainBuy" onClick={() => setMainTab("Trade")}>
                Back to Trade
              </button>
            </div>
          )}
        </aside>
      </div>

      {menuOpen && (
        <div className="sideMenu" onClick={() => setMenuOpen(false)}>
          <div className="menuContent" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="closeMenu" onClick={() => setMenuOpen(false)}>
              ×
            </button>

            <button
              type="button"
              onClick={() => {
                setDepositOpen(true);
                setMenuOpen(false);
              }}
            >
              Deposit
            </button>

            <button
              type="button"
              onClick={() => {
                alert("Withdraw coming soon");
                setMenuOpen(false);
              }}
            >
              Withdraw
            </button>

            <button type="button">History</button>
            <button type="button">Settings</button>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      )}

      {depositOpen && (
        <div className="modal">
          <div className="modalBox">
            <button type="button" className="x" onClick={() => setDepositOpen(false)}>
              ×
            </button>

            <h2>Deposit</h2>
            <p>Send M-Pesa STK Push</p>

            <input placeholder="2547XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <input placeholder="Amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />

            <button type="button" onClick={deposit}>
              Send STK Push
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
