import { useEffect, useState } from "react";
import "./App.css";

const payouts = {
  rise: 1.9,
  fall: 1.9,
  even: 1.9,
  odd: 1.9,
  matches: 9.5,
  differs: 1.15,
  over: 1.6,
  under: 1.6,
};

export default function App() {
  const [balance, setBalance] = useState(10000);
  const [price, setPrice] = useState(1000.25);
  const [lastDigit, setLastDigit] = useState(0);

  const [contract, setContract] = useState("even");
  const [prediction, setPrediction] = useState(5);
  const [duration, setDuration] = useState(5);
  const [stake, setStake] = useState(10);

  const [openTrades, setOpenTrades] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice((old) => {
        const next = Number((old + (Math.random() - 0.5) * 4).toFixed(2));
        const digit = Number(next.toFixed(2).slice(-1));

        setLastDigit(digit);

        setOpenTrades((trades) =>
          trades.map((t) => ({
            ...t,
            ticksLeft: t.ticksLeft - 1,
            exitPrice: next,
            exitDigit: digit,
          }))
        );

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const finished = openTrades.filter((t) => t.ticksLeft <= 0);
    if (!finished.length) return;

    finished.forEach((trade) => closeTrade(trade));
    setOpenTrades((trades) => trades.filter((t) => t.ticksLeft > 0));
  }, [openTrades]);

  function isWin(trade) {
    if (trade.type === "even") return trade.exitDigit % 2 === 0;
    if (trade.type === "odd") return trade.exitDigit % 2 !== 0;
    if (trade.type === "matches") return trade.exitDigit === trade.prediction;
    if (trade.type === "differs") return trade.exitDigit !== trade.prediction;
    if (trade.type === "over") return trade.exitDigit > trade.prediction;
    if (trade.type === "under") return trade.exitDigit < trade.prediction;
    if (trade.type === "rise") return trade.exitPrice > trade.entryPrice;
    if (trade.type === "fall") return trade.exitPrice < trade.entryPrice;
    return false;
  }

  function closeTrade(trade) {
    const won = isWin(trade);
    const returnAmount = won ? Number((trade.stake * trade.payout).toFixed(2)) : 0;
    const profit = won ? Number((returnAmount - trade.stake).toFixed(2)) : -trade.stake;

    if (won) {
      setBalance((b) => Number((b + returnAmount).toFixed(2)));
    }

    setHistory((h) => [
      {
        ...trade,
        result: won ? "WON" : "LOST",
        returnAmount,
        profit,
      },
      ...h,
    ]);
  }

  function buyContract() {
    const amount = Number(stake);
    const ticks = Number(duration);

    if (amount <= 0) return alert("Enter valid stake");
    if (ticks <= 0) return alert("Enter valid duration");
    if (amount > balance) return alert("Insufficient balance");

    const trade = {
      id: Date.now(),
      type: contract,
      prediction: Number(prediction),
      stake: amount,
      payout: payouts[contract],
      entryPrice: price,
      entryDigit: lastDigit,
      exitPrice: price,
      exitDigit: lastDigit,
      ticksLeft: ticks,
    };

    setBalance((b) => Number((b - amount).toFixed(2)));
    setOpenTrades((t) => [trade, ...t]);
  }

  const possiblePayout = Number(stake || 0) * payouts[contract];

  return (
    <div className="mbApp">
      <header className="mbTop">
        <h1>MetaBinary</h1>
        <p>USD {balance.toFixed(2)}</p>
      </header>

      <main className="mbMain">
        <section className="mbChart">
          <div className="mbMarket">
            <h2>Volatility 100 Index</h2>
            <strong>{price.toFixed(2)}</strong>
          </div>

          <div className="mbDigits">
            {[0,1,2,3,4,5,6,7,8,9].map((n) => (
              <button key={n} className={lastDigit === n ? "mbDigit active" : "mbDigit"}>
                {n}
              </button>
            ))}
          </div>

          <div className="mbChartBox">
            <div className="mbLine"></div>
            <div className="mbCursor">{lastDigit}</div>
          </div>
        </section>

        <section className="mbTrade">
          <h2>Trade</h2>

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
              <label>Prediction</label>
              <div className="mbPredict">
                {[0,1,2,3,4,5,6,7,8,9].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPrediction(n)}
                    className={prediction === n ? "selected" : ""}
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

          <button className="mbBuy" onClick={buyContract}>
            Buy contract
          </button>

          <p className="mbPayout">Possible payout: USD {possiblePayout.toFixed(2)}</p>
        </section>
      </main>

      <section className="mbBottom">
        <div>
          <h2>Open trades</h2>
          {openTrades.map((t) => (
            <div className="mbCard open" key={t.id}>
              <b>{t.type.toUpperCase()}</b>
              <span>Stake: USD {t.stake}</span>
              <span>Ticks left: {t.ticksLeft}</span>
            </div>
          ))}
        </div>

        <div>
          <h2>Trade history</h2>
          {history.map((t) => (
            <div className={t.result === "WON" ? "mbCard won" : "mbCard lost"} key={t.id}>
              <b>{t.type.toUpperCase()} - {t.result}</b>
              <span>Exit digit: {t.exitDigit}</span>
              <span>Profit: USD {t.profit.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
