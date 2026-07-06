import { useEffect, useState } from "react";

const PAYOUTS = {
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
  const [digitHistory, setDigitHistory] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const [contract, setContract] = useState("even");
  const [prediction, setPrediction] = useState(5);
  const [duration, setDuration] = useState(5);
  const [stake, setStake] = useState(10);

  const [openTrades, setOpenTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice((oldPrice) => {
        const nextPrice = Number((oldPrice + (Math.random() - 0.5) * 4).toFixed(2));
        const digit = Number(nextPrice.toFixed(2).slice(-1));

        setLastDigit(digit);
        setDigitHistory((old) => [digit, ...old].slice(0, 20));

        setOpenTrades((old) =>
          old.map((trade) => ({
            ...trade,
            ticksLeft: trade.ticksLeft - 1,
            exitPrice: nextPrice,
            exitDigit: digit,
          }))
        );

        return nextPrice;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const finishedTrades = openTrades.filter((trade) => trade.ticksLeft <= 0);
    if (!finishedTrades.length) return;

    finishedTrades.forEach((trade) => settleTrade(trade));
    setOpenTrades((old) => old.filter((trade) => trade.ticksLeft > 0));
  }, [openTrades]);

  function checkWin(trade) {
    if (trade.type === "rise") return trade.exitPrice > trade.entryPrice;
    if (trade.type === "fall") return trade.exitPrice < trade.entryPrice;
    if (trade.type === "even") return trade.exitDigit % 2 === 0;
    if (trade.type === "odd") return trade.exitDigit % 2 !== 0;
    if (trade.type === "matches") return trade.exitDigit === trade.prediction;
    if (trade.type === "differs") return trade.exitDigit !== trade.prediction;
    if (trade.type === "over") return trade.exitDigit > trade.prediction;
    if (trade.type === "under") return trade.exitDigit < trade.prediction;

    return false;
  }

  function settleTrade(trade) {
    const won = checkWin(trade);
    const returnAmount = won ? Number((trade.stake * trade.payout).toFixed(2)) : 0;
    const profit = won ? Number((returnAmount - trade.stake).toFixed(2)) : -trade.stake;

    if (won) {
      setBalance((old) => Number((old + returnAmount).toFixed(2)));
    }

    setTradeHistory((old) => [
      {
        ...trade,
        result: won ? "WON" : "LOST",
        returnAmount,
        profit,
      },
      ...old,
    ]);
  }

  function buyContract() {
    const amount = Number(stake);
    const ticks = Number(duration);

    if (!amount || amount <= 0) {
      alert("Enter valid stake");
      return;
    }

    if (!ticks || ticks <= 0) {
      alert("Enter valid duration");
      return;
    }

    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }

    const trade = {
      id: Date.now(),
      type: contract,
      prediction: Number(prediction),
      stake: amount,
      payout: PAYOUTS[contract],
      entryPrice: price,
      entryDigit: lastDigit,
      exitPrice: price,
      exitDigit: lastDigit,
      ticksLeft: ticks,
      duration: ticks,
    };

    setBalance((old) => Number((old - amount).toFixed(2)));
    setOpenTrades((old) => [trade, ...old]);
  }

  const possiblePayout = Number(stake || 0) * PAYOUTS[contract];
  const possibleProfit = possiblePayout - Number(stake || 0);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, Helvetica, sans-serif;
        }

        html,
        body,
        #root {
          width: 100%;
          min-height: 100%;
          background: #07111d;
        }

        body {
          color: white;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .app {
          min-height: 100vh;
          background: #07111d;
          color: white;
        }

        .topbar {
          background: white;
          color: #111;
          padding: 18px 22px;
        }

        .topbar h1 {
          font-size: 38px;
          font-weight: 900;
          line-height: 1;
        }

        .topbar p {
          font-size: 26px;
          margin-top: 14px;
        }

        .main {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 16px;
          padding: 16px;
        }

        .chartSection {
          background: #07111d;
          overflow: hidden;
        }

        .marketCard {
          background: #101d31;
          padding: 24px 28px;
          border-radius: 20px 20px 0 0;
        }

        .marketCard h2 {
          font-size: 38px;
          font-weight: 900;
          line-height: 1.1;
        }

        .marketCard strong {
          display: block;
          margin-top: 14px;
          color: #2ef2a2;
          font-size: 40px;
          font-weight: 900;
        }

        .digitsStrip {
          background: #101d31;
          display: flex;
          flex-direction: row;
          gap: 14px;
          overflow-x: auto;
          padding: 18px 14px 20px;
          scrollbar-width: thin;
        }

        .digit {
          width: 78px;
          height: 78px;
          min-width: 78px;
          border-radius: 50%;
          border: 1px solid #334761;
          background: #172943;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          font-weight: 900;
        }

        .digit.active {
          background: #ff444f;
          border-color: #ff444f;
          box-shadow: 0 0 25px rgba(255, 68, 79, 0.8);
        }

        .chartBox {
          height: 280px;
          background: linear-gradient(180deg, #10213a, #07111d);
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,.08);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .chartLine {
          position: absolute;
          left: -20%;
          top: 52%;
          width: 140%;
          height: 5px;
          background: #2ef2a2;
          box-shadow: 0 0 22px #2ef2a2;
          animation: moveLine 2s infinite ease-in-out;
        }

        @keyframes moveLine {
          0% { transform: translateY(0); }
          25% { transform: translateY(-35px); }
          50% { transform: translateY(15px); }
          75% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }

        .cursorDigit {
          position: absolute;
          right: 44px;
          top: 39%;
          width: 108px;
          height: 108px;
          border-radius: 50%;
          background: #ff444f;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 52px;
          font-weight: 900;
          box-shadow: 0 0 30px rgba(255, 68, 79, .75);
        }

        .recentDigits {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 14px;
          background: #07111d;
        }

        .recentDigits span {
          min-width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #172943;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .tradePanel {
          background: white;
          color: #111;
          border-radius: 28px;
          padding: 28px;
          height: max-content;
        }

        .tradePanel h2 {
          font-size: 42px;
          font-weight: 900;
          margin-bottom: 28px;
        }

        .tradePanel label {
          display: block;
          font-size: 22px;
          font-weight: 900;
          margin: 18px 0 10px;
        }

        .tradePanel select,
        .tradePanel input {
          width: 100%;
          height: 64px;
          border-radius: 18px;
          border: 1px solid #ddd;
          background: white;
          color: #111;
          padding: 0 20px;
          font-size: 24px;
          outline: none;
        }

        .predictionGrid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 8px;
        }

        .predictionGrid button {
          height: 50px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: #f1f3f6;
          color: #111;
          font-weight: 900;
          cursor: pointer;
        }

        .predictionGrid button.selected {
          background: #ff444f;
          color: white;
          border-color: #ff444f;
        }

        .tradeInfo {
          margin-top: 16px;
          background: #f3f5f7;
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 18px;
        }

        .tradeInfo b {
          color: #111;
        }

        .buyButton {
          width: 100%;
          height: 64px;
          margin-top: 20px;
          border: none;
          border-radius: 18px;
          background: #ff444f;
          color: white;
          font-size: 24px;
          font-weight: 900;
          cursor: pointer;
        }

        .bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 0 16px 16px;
        }

        .box {
          background: #0d1a2b;
          border-radius: 18px;
          padding: 18px;
        }

        .box h2 {
          font-size: 30px;
          margin-bottom: 12px;
        }

        .empty {
          color: #9da8b8;
          font-size: 18px;
        }

        .tradeCard {
          margin-top: 12px;
          background: #101f35;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .tradeCard b {
          font-size: 17px;
        }

        .tradeCard span {
          color: #c6d0dd;
        }

        .open {
          border-left: 5px solid #ffc107;
        }

        .won {
          border-left: 5px solid #2ef2a2;
        }

        .lost {
          border-left: 5px solid #ff444f;
        }

        @media (max-width: 850px) {
          .topbar {
            padding: 20px 28px 28px;
          }

          .topbar h1 {
            font-size: 48px;
          }

          .topbar p {
            font-size: 30px;
          }

          .main {
            display: flex;
            flex-direction: column;
            padding: 0;
            gap: 0;
          }

          .marketCard {
            border-radius: 0;
            padding: 28px;
          }

          .marketCard h2 {
            font-size: 42px;
          }

          .marketCard strong {
            font-size: 44px;
          }

          .digitsStrip {
            padding: 18px 14px 22px;
            gap: 14px;
          }

          .digit {
            width: 78px;
            height: 78px;
            min-width: 78px;
            font-size: 34px;
          }

          .chartBox {
            height: 230px;
          }

          .cursorDigit {
            width: 108px;
            height: 108px;
            right: 42px;
            font-size: 52px;
          }

          .tradePanel {
            width: 100%;
            border-radius: 34px 34px 0 0;
            padding: 40px 52px 36px;
            margin-top: 32px;
          }

          .tradePanel h2 {
            font-size: 46px;
            margin-bottom: 32px;
          }

          .tradePanel label {
            font-size: 28px;
            margin-top: 26px;
            margin-bottom: 14px;
          }

          .tradePanel select,
          .tradePanel input {
            height: 76px;
            font-size: 30px;
            border-radius: 22px;
          }

          .buyButton {
            height: 76px;
            font-size: 30px;
            margin-top: 28px;
          }

          .tradeInfo {
            font-size: 22px;
            padding: 18px;
          }

          .bottom {
            display: flex;
            flex-direction: column;
            padding: 0;
            gap: 0;
          }

          .box {
            border-radius: 0;
            padding: 24px 28px;
          }
        }

        @media (max-width: 430px) {
          .topbar {
            padding: 18px 20px 26px;
          }

          .topbar h1 {
            font-size: 42px;
          }

          .topbar p {
            font-size: 28px;
          }

          .marketCard {
            padding: 24px 28px;
          }

          .marketCard h2 {
            font-size: 38px;
          }

          .marketCard strong {
            font-size: 42px;
          }

          .digit {
            width: 76px;
            height: 76px;
            min-width: 76px;
          }

          .chartBox {
            height: 220px;
          }

          .tradePanel {
            padding: 36px 52px 34px;
            margin-top: 30px;
          }

          .tradePanel h2 {
            font-size: 44px;
          }

          .tradePanel label {
            font-size: 26px;
          }

          .tradePanel select,
          .tradePanel input,
          .buyButton {
            height: 72px;
            font-size: 28px;
          }
        }
      `}</style>

      <div className="app">
        <header className="topbar">
          <h1>MetaBinary</h1>
          <p>USD {balance.toFixed(2)}</p>
        </header>

        <main className="main">
          <section className="chartSection">
            <div className="marketCard">
              <h2>Volatility 100 Index</h2>
              <strong>{price.toFixed(2)}</strong>
            </div>

            <div className="digitsStrip">
              {[0,1,2,3,4,5,6,7,8,9].map((num) => (
                <button
                  key={num}
                  className={lastDigit === num ? "digit active" : "digit"}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="chartBox">
              <div className="chartLine"></div>
              <div className="cursorDigit">{lastDigit}</div>
            </div>

            <div className="recentDigits">
              {digitHistory.map((num, index) => (
                <span key={index}>{num}</span>
              ))}
            </div>
          </section>

          <section className="tradePanel">
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
                <div className="predictionGrid">
                  {[0,1,2,3,4,5,6,7,8,9].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPrediction(num)}
                      className={prediction === num ? "selected" : ""}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </>
            )}

            <label>Duration ticks</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <label>Stake</label>
            <input
              type="number"
              min="1"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />

            <div className="tradeInfo">
              <span>Possible payout</span>
              <b>USD {possiblePayout.toFixed(2)}</b>
            </div>

            <div className="tradeInfo">
              <span>Net profit</span>
              <b>USD {possibleProfit.toFixed(2)}</b>
            </div>

            <button className="buyButton" onClick={buyContract}>
              Buy contract
            </button>
          </section>
        </main>

        <section className="bottom">
          <div className="box">
            <h2>Open trades</h2>
            {openTrades.length === 0 && <p className="empty">No open trades</p>}

            {openTrades.map((trade) => (
              <div className="tradeCard open" key={trade.id}>
                <b>{trade.type.toUpperCase()}</b>
                <span>Stake: USD {trade.stake}</span>
                <span>Entry digit: {trade.entryDigit}</span>
                <span>Ticks left: {trade.ticksLeft}</span>
              </div>
            ))}
          </div>

          <div className="box">
            <h2>Trade history</h2>
            {tradeHistory.length === 0 && <p className="empty">No closed trades</p>}

            {tradeHistory.map((trade) => (
              <div
                key={trade.id}
                className={trade.result === "WON" ? "tradeCard won" : "tradeCard lost"}
              >
                <b>{trade.type.toUpperCase()} — {trade.result}</b>
                <span>Stake: USD {trade.stake}</span>
                <span>Exit digit: {trade.exitDigit}</span>
                <span>Return: USD {trade.returnAmount.toFixed(2)}</span>
                <span>Profit: USD {trade.profit.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
