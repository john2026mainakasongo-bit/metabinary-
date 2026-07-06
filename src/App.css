import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CONTRACTS = ["Rise/Fall", "Even/Odd", "Matches/Differs", "Over/Under"];

const CHOICES = {
  "Rise/Fall": ["Rise", "Fall"],
  "Even/Odd": ["Even", "Odd"],
  "Matches/Differs": ["Matches", "Differs"],
  "Over/Under": ["Over", "Under"],
};

function createChartData() {
  let y = 250;

  return Array.from({ length: 90 }, (_, i) => {
    y += (Math.random() - 0.48) * 28;
    y = Math.max(115, Math.min(360, y));
    return { x: 40 + i * 14, y };
  });
}

export default function App() {
  const [screen, setScreen] = useState(
    localStorage.getItem("token") ? "app" : "login"
  );

  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState(localStorage.getItem("mode") || "Demo");
  const [balance, setBalance] = useState({ demo: 10000, real: 0 });

  const [mainTab, setMainTab] = useState("Manual Trader");

  const [contractType, setContractType] = useState("Rise/Fall");
  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState(5);
  const [botRuns, setBotRuns] = useState(3);

  const [previousDigit, setPreviousDigit] = useState(8);
  const [lastDigit, setLastDigit] = useState(8);
  const [selectedDigit, setSelectedDigit] = useState(8);

  const [chartData, setChartData] = useState(createChartData);

  const [openTrades, setOpenTrades] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [depositAmount, setDepositAmount] = useState(10);

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

  async function refreshBalance() {
    if (!email) return;

    try {
      const res = await fetch(`${API}/api/user/${email}`);
      const data = await res.json();

      if (data.success && data.user) {
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
        nextY = Math.max(115, Math.min(360, nextY));

        const next = old.slice(1).map((p, i) => ({
          x: 40 + i * 14,
          y: p.y,
        }));

        next.push({
          x: 40 + (old.length - 1) * 14,
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

  function checkWin(type, choice, targetDigit, startDigit, finalDigit) {
    if (type === "Even/Odd") {
      return choice === "Even" ? finalDigit % 2 === 0 : finalDigit % 2 !== 0;
    }

    if (type === "Matches/Differs") {
      return choice === "Matches"
        ? finalDigit === targetDigit
        : finalDigit !== targetDigit;
    }

    if (type === "Over/Under") {
      return choice === "Over" ? finalDigit > targetDigit : finalDigit < targetDigit;
    }

    if (type === "Rise/Fall") {
      return choice === "Rise" ? finalDigit > startDigit : finalDigit < startDigit;
    }

    return false;
  }

  function trade({ type, choice }) {
    const tradeStake = Number(stake);
    const tradeDuration = Number(duration);

    if (tradeStake <= 0) return alert("Enter stake");
    if (tradeDuration <= 0) return alert("Enter duration");
    if (currentBalance < tradeStake) return alert("Insufficient balance");

    const id = Date.now() + Math.random();
    const targetDigit = selectedDigit;
    const startDigit = previousDigit;

    const item = {
      id,
      contractType: type,
      choice,
      stake: tradeStake,
      target: targetDigit,
      startDigit,
      duration: tradeDuration,
      mode,
      status: "Running",
    };

    setOpenTrades((x) => [item, ...x]);

    setBalance((b) =>
      mode === "Demo"
        ? { ...b, demo: b.demo - tradeStake }
        : { ...b, real: b.real - tradeStake }
    );

    setTimeout(() => {
      const finalDigit = Math.floor(Math.random() * 10);
      setPreviousDigit(lastDigit);
      setLastDigit(finalDigit);
      setSelectedDigit(finalDigit);

      const win = checkWin(type, choice, targetDigit, startDigit, finalDigit);
      const payout = win ? tradeStake * 1.9 : 0;

      setOpenTrades((x) => x.filter((t) => t.id !== id));
      setClosedTrades((x) => [{ ...item, result: finalDigit, win, payout }, ...x]);

      if (win) {
        setBalance((b) =>
          mode === "Demo"
            ? { ...b, demo: b.demo + payout }
            : { ...b, real: b.real + payout }
        );
      }
    }, tradeDuration * 1000);
  }

  function runFreeBot() {
    const runs = Number(botRuns);
    if (runs <= 0) return alert("Enter bot runs");

    for (let i = 0; i < runs; i++) {
      setTimeout(() => {
        trade({
          type: contractType,
          choice: CHOICES[contractType][0],
        });
      }, i * 1400);
    }
  }

  async function deposit() {
    if (!phone || !depositAmount) return alert("Enter phone and amount");

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
          <button className="topMenuBtn" type="button" onClick={() => setMenuOpen(true)}>
            ☰
          </button>

          <select
            className="topAccount"
            value={mode}
            onChange={(e) => changeMode(e.target.value)}
          >
            <option>Demo</option>
            <option>Real</option>
          </select>

          <div className="topBalance">${currentBalance.toFixed(2)}</div>
        </div>

        <div className="mainTabs">
          {["Bot Builder", "Manual Trader", "Bulk Trader"].map((tab) => (
            <button
              type="button"
              key={tab}
              className={mainTab === tab ? "active" : ""}
              onClick={() => setMainTab(tab)}
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
            {openTrades.length === 0 && closedTrades.length === 0 && (
              <>
                <div className="avatar">MB</div>
                <h2>No positions</h2>
                <p>Your trades will appear here</p>
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
              <div className={`tradeCard ${t.win ? "win" : "loss"}`} key={t.id}>
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
                <h1>Volatility 100 (1s) Index</h1>
                <p>{price} - 0.02 (0.00%)</p>
              </div>

              <div className="lastDigitBadge">{lastDigit}</div>
            </div>

            <div className="chart">
              <svg viewBox="0 0 1300 450" preserveAspectRatio="none">
                <polyline
                  points={points}
                  fill="none"
                  stroke="#12d6b3"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="priceTag">{price}</div>
              <div className="cursorDigit">{lastDigit}</div>
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
          {mainTab === "Manual Trader" && (
            <>
              <div className="tradeBox">
                <p className="learn">ⓘ Select contract type</p>

                <div className="tradeSelector">
                  {CONTRACTS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={contractType === item ? "active" : ""}
                      onClick={() => setContractType(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {(contractType === "Matches/Differs" || contractType === "Over/Under") && (
                <div className="tradeBox">
                  <h3>Select digit</h3>

                  <div className="selectDigits">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                      <button
                        type="button"
                        key={digit}
                        onClick={() => setSelectedDigit(digit)}
                        className={selectedDigit === digit ? "active" : ""}
                      >
                        {digit}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="tradeRowNew">
                <span>Duration</span>

                <div className="stepper">
                  <button
                    type="button"
                    onClick={() => setDuration(Math.max(1, Number(duration) - 1))}
                  >
                    −
                  </button>

                  <b>{duration} ticks</b>

                  <button
                    type="button"
                    onClick={() => setDuration(Number(duration) + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="tradeRowNew">
                <span>Stake</span>

                <div className="stepper">
                  <button
                    type="button"
                    onClick={() => setStake(Math.max(1, Number(stake) - 1))}
                  >
                    −
                  </button>

                  <b>{stake} USD</b>

                  <button type="button" onClick={() => setStake(Number(stake) + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="tradeActions">
                {CHOICES[contractType].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => trade({ type: contractType, choice: item })}
                    className={index === 0 ? "riseAction" : "fallAction"}
                  >
                    <strong>{item}</strong>
                    <small>
                      Payout <b>{(Number(stake) * 1.9).toFixed(2)} USD</b>
                    </small>
                  </button>
                ))}
              </div>
            </>
          )}

          {mainTab === "Bot Builder" && (
            <div className="toolBox">
              <h2>Free Bot</h2>
              <p>Run automatic trades using your current selected contract.</p>

              <label>Bot Runs</label>
              <input
                value={botRuns}
                onChange={(e) => setBotRuns(e.target.value)}
              />

              <button type="button" className="mainBuy" onClick={runFreeBot}>
                Start Free Bot
              </button>
            </div>
          )}

          {mainTab === "Bulk Trader" && (
            <div className="toolBox">
              <h2>Bulk Trader</h2>
              <p>Bulk trading is coming soon on MetaBinary.</p>

              <button
                type="button"
                className="mainBuy"
                onClick={() => setMainTab("Manual Trader")}
              >
                Back to Manual Trader
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
            <button type="button" onClick={logout}>Logout</button>
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
            <p>Send M-Pesa STK Push to your phone</p>

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
