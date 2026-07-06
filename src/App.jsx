import { useEffect, useState } from "react";
import "./App.css";

const PAYOUT = 1.95;

export default function App() {
  const [balance, setBalance] = useState(10000);
  const [price, setPrice] = useState(1000);
  const [digit, setDigit] = useState(0);

  const [contract, setContract] = useState("even");
  const [prediction, setPrediction] = useState(5);
  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState(5);

  const [openTrades, setOpenTrades] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice((p) => {
        const next = +(p + (Math.random() - 0.5) * 4).toFixed(2);
        const lastDigit = Number(String(next.toFixed(2)).slice(-1));
        setDigit(lastDigit);
        return next;
      });

      setOpenTrades((trades) =>
        trades.map((t) => ({ ...t, ticksLeft: t.ticksLeft - 1 }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const finished = openTrades.filter((t) => t.ticksLeft <= 0);
    if (!finished.length) return;

    finished.forEach((trade) => settleTrade(trade));

    setOpenTrades((trades) => trades.filter((t) => t.ticksLeft > 0));
  }, [openTrades]);

  function checkWin(trade) {
    if (trade.type === "even") return digit % 2 === 0;
    if (trade.type === "odd") return digit % 2 !== 0;

    if (trade.type === "matches") return digit === trade.prediction;
    if (trade.type === "differs") return digit !== trade.prediction;

    if (trade.type === "over") return digit > trade.prediction;
    if (trade.type === "under") return digit < trade.prediction;

    if (trade.type === "rise") return price > trade.entryPrice;
    if (trade.type === "fall") return price < trade.entryPrice;

    return false;
  }

  function settleTrade(trade) {
    const won = checkWin(trade);
    const payout = won ? +(trade.stake * PAYOUT).toFixed(2) : 0;
    const profit = won ? +(payout - trade.stake).toFixed(2) : -trade.stake;

    if (won) {
      setBalance((b) => +(b + payout).toFixed(2));
    }

    setHistory((h) => [
      {
        ...trade,
        exitPrice: price,
        exitDigit: digit,
        result: won ? "WON" : "LOST",
        profit,
      },
      ...h,
    ]);
  }

  function placeTrade() {
    const amount = Number(stake);

    if (!amount || amount <= 0) {
      alert("Enter valid stake");
      return;
    }

    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }

    const trade = {
      id: Date.now(),
      type: contract,
      prediction,
      stake: amount,
      entryPrice: price,
      entryDigit: digit,
      ticksLeft: Number(duration),
    };

    setBalance((b) => +(b - amount).toFixed(2));
    setOpenTrades((t) => [trade, ...t]);
  }

  return (
    <div className="app">
      <header className="topbar">
        <h2>MetaBinary</h2>
        <div className="wallet">USD {balance.toFixed(2)}</div>
      </header>

      <main className="layout">
        <section className="chart">
          <h3>Volatility 100 Index</h3>

          <div className="price">{price.toFixed(2)}</div>

          <div className="digits">
            {[0,1,2,3,4,5,6,7,8,9].map((n) => (
              <div key={n} className={digit === n ? "digit active" : "digit"}>
                {n}
              </div>
            ))}
          </div>

          <div className="fakeChart">
            <div className="line"></div>
          </div>
        </section>

        <aside className="tradePanel">
          <h3>Trade</h3>

          <label>Contract type</label>
          <select value={contract} onChange={(e) => setContract(e.target.value)}>
            <option value="rise">Rise</option>
            <option value="fall">Fall</option>
            <option value="even">Even</option>
            <option value="odd">Odd</option>
            <option value="matches">Matches</option>
            <option value="differs">Differs</option>
            <option value="over">Over</option>
            <option value="under">Under</option>
          </select>

          {["matches", "differs", "over", "under"].includes(contract) && (
            <>
              <label>Prediction digit</label>
              <div className="predictDigits">
                {[0,1,2,3,4,5,6,7,8,9].map((n) => (
                  <button
                    key={n}
                    className={prediction === n ? "selected" : ""}
                    onClick={() => setPrediction(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </>
          )}

          <label>Duration ticks</label>
          <input
            type="number"
            value={duration}
            min="1"
            onChange={(e) => setDuration(e.target.value)}
          />

          <label>Stake</label>
          <input
            type="number"
            value={stake}
            min="1"
            onChange={(e) => setStake(e.target.value)}
          />

          <button className="buyBtn" onClick={placeTrade}>
            Buy contract
          </button>

          <p className="returns">
            Possible payout: USD {(stake * PAYOUT).toFixed(2)}
          </p>
        </aside>
      </main>

      <section className="positions">
        <div>
          <h3>Open trades</h3>
          {openTrades.map((t) => (
            <div className="trade open" key={t.id}>
              <b>{t.type.toUpperCase()}</b>
              <span>Stake: {t.stake}</span>
              <span>Ticks left: {t.ticksLeft}</span>
            </div>
          ))}
        </div>

        <div>
          <h3>Trade history</h3>
          {history.map((t) => (
            <div className={t.result === "WON" ? "trade won" : "trade lost"} key={t.id}>
              <b>{t.type.toUpperCase()} — {t.result}</b>
              <span>Entry digit: {t.entryDigit}</span>
              <span>Exit digit: {t.exitDigit}</span>
              <span>Profit: USD {t.profit.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
