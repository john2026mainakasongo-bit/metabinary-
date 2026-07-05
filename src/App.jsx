import { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [account, setAccount] = useState("Real");
  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState(5);
  const [activeTab, setActiveTab] = useState("Even/Odd");
  const [lastDigit, setLastDigit] = useState(8);

  const points = useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => {
      const x = i * 10;
      const y = 170 + Math.sin(i * 1.7) * 35 + Math.random() * 45;
      return `${x},${y}`;
    }).join(" ");
  }, []);

  return (
    <div className="platform">
      <header className="topbar">
        <div className="brand">MetaBinary</div>

        <nav>
          <button>Trader&apos;s Hub</button>
          <button>Deposit</button>
          <button>Withdraw</button>
          <button>History</button>
          <button>Chat</button>
          <button>Logout</button>
        </nav>

        <div className="accountBox">
          <select value={account} onChange={(e) => setAccount(e.target.value)}>
            <option>Real</option>
            <option>Demo</option>
          </select>
          <strong>$1.00</strong>
          <button className="deposit">Deposit</button>
        </div>
      </header>

      <div className="layout">
        <aside className="leftPanel">
          <div className="tabs">
            <span className="active">Open (0)</span>
            <span>Closed (0)</span>
          </div>

          <div className="empty">
            <div className="avatar">MB</div>
            <h2>No open positions</h2>
            <p>Your MetaBinary trades will appear here</p>
          </div>

          <small>0 open positions</small>
        </aside>

        <main className="chartWrap">
          <section className="chartCard">
            <div className="chartTitle">
              <div>
                <h1>Volatility 100 (1s)</h1>
                <p>Live Synthetic Market</p>
              </div>
              <div className="digitBox">{lastDigit}</div>
            </div>

            <div className="chart">
              <svg viewBox="0 0 900 380" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="90" height="55" patternUnits="userSpaceOnUse">
                    <path d="M 90 0 L 0 0 0 55" fill="none" stroke="#263247" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <polyline
                  points={points}
                  fill="none"
                  stroke="#dbe4f0"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="digits">
              {[0,1,2,3,4,5,6,7,8,9].map((d) => (
                <button
                  key={d}
                  onClick={() => setLastDigit(d)}
                  className={d === 4 ? "selected" : ""}
                >
                  <b>{d}</b>
                  <span>{(12.3 + Math.random()).toFixed(1)}%</span>
                </button>
              ))}
            </div>
          </section>
        </main>

        <aside className="tradePanel">
          <p className="learn">ⓘ Learn about this trade type</p>

          <h1>{activeTab}</h1>

          <div className="contractTabs">
            {["Even/Odd", "Matches/Differs", "Over/Under", "Rise/Fall", "Touch/No Touch"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "active" : ""}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tradeMode">
            <span>Trade Mode</span>
            <b>Manual</b>
          </div>

          <div className="choice">
            <button className="green">Even</button>
            <button>Odd</button>
          </div>

          <label>Duration ticks</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} />

          <label>Stake</label>
          <input value={stake} onChange={(e) => setStake(e.target.value)} />

          <button className="buy even">
            Even
            <span>Payout 19.00 USD</span>
          </button>

          <button className="buy odd">
            Odd
            <span>Payout 19.00 USD</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
