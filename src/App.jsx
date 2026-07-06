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
  const [account, setAccount] = useState("Real");
  const [balance, setBalance] = useState(40);
  const [price, setPrice] = useState(819.75);
  const [lastDigit, setLastDigit] = useState(7);

  const [mode, setMode] = useState("risefall");
  const [prediction, setPrediction] = useState(7);
  const [duration, setDuration] = useState(5);
  const [stake, setStake] = useState(10);

  const [openTrades, setOpenTrades] = useState([]);
  const [history, setHistory] = useState([]);

  const percentages = [9.9, 11.3, 9.3, 11.9, 11.2, 8.1, 11.4, 10.1, 9.9, 10.7];

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice((old) => {
        const next = Number((old + (Math.random() - 0.5) * 2).toFixed(2));
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

    finished.forEach(closeTrade);
    setOpenTrades((old) => old.filter((t) => t.ticksLeft > 0));
  }, [openTrades]);

  function checkWin(t) {
    if (t.type === "rise") return t.exitPrice > t.entryPrice;
    if (t.type === "fall") return t.exitPrice < t.entryPrice;
    if (t.type === "even") return t.exitDigit % 2 === 0;
    if (t.type === "odd") return t.exitDigit % 2 !== 0;
    if (t.type === "matches") return t.exitDigit === t.prediction;
    if (t.type === "differs") return t.exitDigit !== t.prediction;
    if (t.type === "over") return t.exitDigit > t.prediction;
    if (t.type === "under") return t.exitDigit < t.prediction;
    return false;
  }

  function closeTrade(trade) {
    const won = checkWin(trade);
    const returned = won ? Number((trade.stake * trade.payout).toFixed(2)) : 0;
    const profit = won ? Number((returned - trade.stake).toFixed(2)) : -trade.stake;

    if (won) setBalance((b) => Number((b + returned).toFixed(2)));

    setHistory((h) => [{ ...trade, result: won ? "WON" : "LOST", returned, profit }, ...h]);
  }

  function buy(type) {
    if (stake <= 0) return alert("Enter valid stake");
    if (duration <= 0) return alert("Enter valid duration");
    if (stake > balance) return alert("Insufficient balance");

    const trade = {
      id: Date.now(),
      type,
      prediction,
      stake,
      payout: PAYOUTS[type],
      entryPrice: price,
      entryDigit: lastDigit,
      exitPrice: price,
      exitDigit: lastDigit,
      ticksLeft: duration,
    };

    setBalance((b) => Number((b - stake).toFixed(2)));
    setOpenTrades((t) => [trade, ...t]);
  }

  function buyButtons() {
    if (mode === "risefall") return ["rise", "fall"];
    if (mode === "evenodd") return ["even", "odd"];
    if (mode === "matchesdiffers") return ["matches", "differs"];
    if (mode === "overunder") return ["over", "under"];
    return ["rise", "fall"];
  }

  function title(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial,Helvetica,sans-serif;
        }

        html,body,#root{
          width:100% !important;
          min-width:100% !important;
          max-width:none !important;
          min-height:100% !important;
          background:#f2f2f2;
          overflow-x:hidden;
        }

        body{
          margin:0 !important;
          padding:0 !important;
        }

        button,select{
          font:inherit;
        }

        .app{
          width:100% !important;
          max-width:none !important;
          min-height:100vh;
          margin:0 !important;
          background:#f2f2f2;
          color:#111;
          overflow-x:hidden;
        }

        .top{
          height:78px;
          background:white;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 16px;
        }

        .menu{
          font-size:36px;
          font-weight:900;
          line-height:1;
        }

        .account{
          height:48px;
          width:110px;
          border:2px solid #111;
          border-radius:15px;
          padding:0 12px;
          font-size:18px;
          font-weight:900;
          background:white;
          color:#111;
        }

        .wallet{
          min-width:110px;
          height:48px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid #ddd;
          border-radius:15px;
          background:white;
          color:#19b8aa;
          font-size:24px;
          font-weight:900;
        }

        .tabs{
          height:56px;
          display:grid;
          grid-template-columns:repeat(4,1fr);
          background:#07111d;
        }

        .tabs button{
          border:none;
          background:#07111d;
          color:white;
          font-size:14px;
          font-weight:900;
        }

        .tabs .active{
          background:#19b8aa;
        }

        .market{
          margin:12px 16px;
          background:white;
          border:1px solid #ddd;
          border-radius:20px;
          padding:16px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
        }

        .market h1{
          font-size:22px;
          line-height:1.1;
          font-weight:900;
        }

        .market p{
          margin-top:6px;
          color:#19b8aa;
          font-size:16px;
          font-weight:900;
        }

        .last{
          width:56px;
          height:56px;
          min-width:56px;
          border-radius:50%;
          background:#19b8aa;
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:28px;
          font-weight:900;
        }

        .digits{
          margin:0 22px 12px;
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:12px 16px;
          justify-items:center;
        }

        .digit{
          width:54px;
          height:54px;
          border-radius:50%;
          border:6px solid #e9edf3;
          background:white;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          font-weight:900;
          font-size:22px;
        }

        .digit span{
          font-size:11px;
          color:#8c95a1;
          margin-top:1px;
        }

        .digit.active{
          border-color:#19b8aa;
        }

        .panel{
          background:white;
          margin:0 16px 12px;
          padding:16px 14px;
          border-radius:20px;
        }

        .panelTitle{
          color:#9aa3ae;
          font-size:16px;
          margin-bottom:12px;
        }

        .contractGrid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
        }

        .contractGrid button{
          height:52px;
          border-radius:14px;
          border:1px solid #ddd;
          background:#f8f8f8;
          color:#111;
          font-size:16px;
          font-weight:900;
        }

        .contractGrid button.active{
          background:#19b8aa;
          border-color:#19b8aa;
          color:white;
        }

        .prediction{
          background:white;
          margin:0 16px 12px;
          padding:14px;
          border-radius:20px;
        }

        .prediction h3{
          font-size:17px;
          margin-bottom:10px;
        }

        .predictionGrid{
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:8px;
        }

        .predictionGrid button{
          height:40px;
          border-radius:50%;
          border:1px solid #ddd;
          background:#f2f4f7;
          font-size:16px;
          font-weight:900;
        }

        .predictionGrid button.active{
          background:#19b8aa;
          color:white;
          border-color:#19b8aa;
        }

        .control{
          height:62px;
          margin:0 16px 10px;
          padding:0 18px;
          background:white;
          border-radius:18px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .control h2{
          font-size:19px;
          font-weight:900;
        }

        .stepper{
          display:flex;
          align-items:center;
          gap:12px;
          font-size:20px;
          font-weight:900;
        }

        .stepper button{
          width:36px;
          height:36px;
          border:none;
          border-radius:50%;
          background:#edf0f4;
          color:#111;
          font-size:24px;
          font-weight:900;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .buyGrid{
          margin:14px 16px 10px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
        }

        .buyBtn{
          height:88px;
          border:none;
          border-radius:20px;
          color:white;
          font-size:28px;
          font-weight:900;
        }

        .buyBtn span{
          display:block;
          margin-top:6px;
          font-size:13px;
          font-weight:900;
        }

        .green{
          background:#19b8aa;
        }

        .red{
          background:#ff4057;
        }

        .positions{
          padding:8px 16px 24px;
        }

        .positions h2{
          font-size:20px;
          margin:10px 0 8px;
        }

        .empty{
          color:#777;
          font-size:14px;
        }

        .tradeCard{
          background:white;
          border-radius:14px;
          padding:12px;
          margin-bottom:8px;
          display:flex;
          flex-direction:column;
          gap:3px;
          font-size:14px;
        }

        .open{
          border-left:5px solid #ffc107;
        }

        .won{
          border-left:5px solid #19b8aa;
        }

        .lost{
          border-left:5px solid #ff4057;
        }

        @media(max-width:380px){
          .top{
            padding:0 12px;
          }

          .wallet{
            min-width:96px;
            font-size:20px;
          }

          .account{
            width:96px;
            font-size:17px;
          }

          .tabs button{
            font-size:12px;
          }

          .market h1{
            font-size:20px;
          }

          .digit{
            width:48px;
            height:48px;
            font-size:20px;
          }

          .control{
            padding:0 14px;
          }

          .stepper{
            gap:8px;
            font-size:18px;
          }

          .buyBtn{
            font-size:25px;
          }
        }
      `}</style>

      <div className="app">
        <div className="top">
          <div className="menu">☰</div>

          <select className="account" value={account} onChange={(e) => setAccount(e.target.value)}>
            <option>Real</option>
            <option>Demo</option>
          </select>

          <div className="wallet">${balance.toFixed(2)}</div>
        </div>

        <div className="tabs">
          <button className="active">Trade</button>
          <button>Charts</button>
          <button>Free Bot</button>
          <button>Copy Trading</button>
        </div>

        <div className="market">
          <div>
            <h1>Volatility 100 (1s) Index</h1>
            <p>{price.toFixed(2)} - 0.02 (0.00%)</p>
          </div>

          <div className="last">{lastDigit}</div>
        </div>

        <div className="digits">
          {[0,1,2,3,4,5,6,7,8,9].map((n) => (
            <div key={n} className={lastDigit === n ? "digit active" : "digit"}>
              {n}
              <span>{percentages[n]}%</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panelTitle">⌄ Select contract type</div>

          <div className="contractGrid">
            <button className={mode === "risefall" ? "active" : ""} onClick={() => setMode("risefall")}>
              Rise/Fall
            </button>

            <button className={mode === "evenodd" ? "active" : ""} onClick={() => setMode("evenodd")}>
              Even/Odd
            </button>

            <button className={mode === "matchesdiffers" ? "active" : ""} onClick={() => setMode("matchesdiffers")}>
              Matches/Differs
            </button>

            <button className={mode === "overunder" ? "active" : ""} onClick={() => setMode("overunder")}>
              Over/Under
            </button>
          </div>
        </div>

        {["matchesdiffers", "overunder"].includes(mode) && (
          <div className="prediction">
            <h3>Prediction digit</h3>

            <div className="predictionGrid">
              {[0,1,2,3,4,5,6,7,8,9].map((n) => (
                <button key={n} onClick={() => setPrediction(n)} className={prediction === n ? "active" : ""}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="control">
          <h2>Duration</h2>

          <div className="stepper">
            <button onClick={() => setDuration(Math.max(1, duration - 1))}>−</button>
            <b>{duration} ticks</b>
            <button onClick={() => setDuration(duration + 1)}>+</button>
          </div>
        </div>

        <div className="control">
          <h2>Stake</h2>

          <div className="stepper">
            <button onClick={() => setStake(Math.max(1, stake - 1))}>−</button>
            <b>{stake} USD</b>
            <button onClick={() => setStake(stake + 1)}>+</button>
          </div>
        </div>

        <div className="buyGrid">
          {buyButtons().map((b, index) => (
            <button key={b} onClick={() => buy(b)} className={index === 0 ? "buyBtn green" : "buyBtn red"}>
              {title(b)}
              <span>Payout {(stake * PAYOUTS[b]).toFixed(2)} USD</span>
            </button>
          ))}
        </div>

        <div className="positions">
          <h2>Open trades</h2>

          {openTrades.length === 0 && <p className="empty">No open trades</p>}

          {openTrades.map((t) => (
            <div className="tradeCard open" key={t.id}>
              <b>{t.type.toUpperCase()}</b>
              <span>Stake: {t.stake} USD</span>
              <span>Entry digit: {t.entryDigit}</span>
              <span>Ticks left: {t.ticksLeft}</span>
            </div>
          ))}

          <h2>Trade history</h2>

          {history.length === 0 && <p className="empty">No closed trades</p>}

          {history.map((t) => (
            <div key={t.id} className={t.result === "WON" ? "tradeCard won" : "tradeCard lost"}>
              <b>{t.type.toUpperCase()} — {t.result}</b>
              <span>Exit digit: {t.exitDigit}</span>
              <span>Return: {t.returned.toFixed(2)} USD</span>
              <span>Profit: {t.profit.toFixed(2)} USD</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
