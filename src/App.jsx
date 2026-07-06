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
  const [side, setSide] = useState("rise");
  const [prediction, setPrediction] = useState(7);
  const [duration, setDuration] = useState(5);
  const [stake, setStake] = useState(10);

  const [openTrades, setOpenTrades] = useState([]);
  const [history, setHistory] = useState([]);

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

    if (won) {
      setBalance((b) => Number((b + returned).toFixed(2)));
    }

    setHistory((h) => [
      {
        ...trade,
        result: won ? "WON" : "LOST",
        returned,
        profit,
      },
      ...h,
    ]);
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

  function buttons() {
    if (mode === "risefall") return ["rise", "fall"];
    if (mode === "evenodd") return ["even", "odd"];
    if (mode === "matchesdiffers") return ["matches", "differs"];
    if (mode === "overunder") return ["over", "under"];
    return ["rise", "fall"];
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
          width:100%;
          min-height:100%;
          background:#f3f3f3;
        }

        body{
          color:#111;
        }

        button,select,input{
          font:inherit;
        }

        .app{
          max-width:460px;
          min-height:100vh;
          margin:0 auto;
          background:#f2f2f2;
        }

        .top{
          height:96px;
          background:white;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 20px;
          border-bottom:1px solid #eee;
        }

        .menu{
          font-size:44px;
          font-weight:900;
        }

        .account{
          height:58px;
          width:125px;
          border:3px solid #111;
          border-radius:18px;
          padding:0 15px;
          font-size:22px;
          font-weight:900;
          background:white;
        }

        .wallet{
          border:1px solid #ddd;
          border-radius:18px;
          padding:15px 22px;
          color:#17b7a6;
          font-size:28px;
          font-weight:900;
          background:white;
        }

        .tabs{
          height:66px;
          display:grid;
          grid-template-columns:repeat(4,1fr);
          background:#07111d;
        }

        .tabs button{
          border:none;
          background:#07111d;
          color:white;
          font-weight:900;
          font-size:15px;
        }

        .tabs button.active{
          background:#18b8aa;
        }

        .marketCard{
          margin:18px 20px;
          background:white;
          border:1px solid #ddd;
          border-radius:22px;
          padding:20px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .marketCard h1{
          font-size:26px;
          line-height:1.1;
        }

        .marketCard p{
          margin-top:8px;
          color:#18b8aa;
          font-size:19px;
          font-weight:900;
        }

        .lastBubble{
          width:70px;
          height:70px;
          border-radius:50%;
          background:#18b8aa;
          color:white;
          display:grid;
          place-items:center;
          font-size:34px;
          font-weight:900;
        }

        .digits{
          margin:0 20px 18px;
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:18px 22px;
        }

        .digit{
          width:62px;
          height:62px;
          border-radius:50%;
          border:8px solid #edf0f4;
          background:white;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          font-weight:900;
          font-size:26px;
        }

        .digit span{
          font-size:13px;
          color:#8d96a3;
          margin-top:2px;
        }

        .digit.active{
          border-color:#18b8aa;
        }

        .contractBox{
          background:white;
          margin:0 20px 20px;
          padding:22px 16px;
          border-radius:22px;
        }

        .contractBox h3{
          color:#9ba3af;
          font-size:18px;
          margin-bottom:14px;
        }

        .contractGrid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
        }

        .contractGrid button{
          height:62px;
          border-radius:16px;
          border:1px solid #ddd;
          background:#f8f8f8;
          font-size:18px;
          font-weight:900;
        }

        .contractGrid button.active{
          background:#18b8aa;
          color:white;
          border-color:#18b8aa;
        }

        .predictBox{
          background:white;
          margin:0 20px 20px;
          padding:18px;
          border-radius:22px;
        }

        .predictBox h3{
          margin-bottom:12px;
          font-size:18px;
        }

        .predictDigits{
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:10px;
        }

        .predictDigits button{
          height:46px;
          border-radius:50%;
          border:1px solid #ddd;
          background:#f3f5f7;
          font-weight:900;
        }

        .predictDigits button.active{
          background:#18b8aa;
          color:white;
        }

        .control{
          margin:0 20px 16px;
          height:76px;
          background:white;
          border-radius:18px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 24px;
        }

        .control h2{
          font-size:22px;
        }

        .stepper{
          display:flex;
          align-items:center;
          gap:18px;
          font-size:24px;
          font-weight:900;
        }

        .stepper button{
          width:44px;
          height:44px;
          border:none;
          border-radius:50%;
          background:#edf0f4;
          font-size:28px;
          font-weight:900;
        }

        .buyGrid{
          margin:22px 20px 12px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:16px;
        }

        .buyBtn{
          height:112px;
          border:none;
          border-radius:22px;
          color:white;
          font-weight:900;
          font-size:34px;
        }

        .buyBtn span{
          display:block;
          font-size:15px;
          margin-top:8px;
        }

        .green{
          background:#18b8aa;
        }

        .red{
          background:#ff4057;
        }

        .positions{
          margin:20px;
        }

        .positions h2{
          font-size:22px;
          margin:12px 0;
        }

        .tradeCard{
          background:white;
          border-radius:14px;
          padding:12px;
          margin-bottom:10px;
          display:flex;
          flex-direction:column;
          gap:4px;
        }

        .won{
          border-left:5px solid #18b8aa;
        }

        .lost{
          border-left:5px solid #ff4057;
        }

        .open{
          border-left:5px solid #ffc107;
        }

        @media(min-width:800px){
          .app{
            max-width:100%;
          }

          .content{
            max-width:460px;
            margin:0 auto;
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

        <div className="content">
          <div className="marketCard">
            <div>
              <h1>Volatility 100 (1s) Index</h1>
              <p>{price.toFixed(2)} - 0.02 (0.00%)</p>
            </div>
            <div className="lastBubble">{lastDigit}</div>
          </div>

          <div className="digits">
            {[0,1,2,3,4,5,6,7,8,9].map((n) => (
              <div key={n} className={lastDigit === n ? "digit active" : "digit"}>
                {n}
                <span>{(8 + Math.random() * 4).toFixed(1)}%</span>
              </div>
            ))}
          </div>

          <div className="contractBox">
            <h3>⌄ Select contract type</h3>
            <div className="contractGrid">
              <button
                className={mode === "risefall" ? "active" : ""}
                onClick={() => setMode("risefall")}
              >
                Rise/Fall
              </button>

              <button
                className={mode === "evenodd" ? "active" : ""}
                onClick={() => setMode("evenodd")}
              >
                Even/Odd
              </button>

              <button
                className={mode === "matchesdiffers" ? "active" : ""}
                onClick={() => setMode("matchesdiffers")}
              >
                Matches/Differs
              </button>

              <button
                className={mode === "overunder" ? "active" : ""}
                onClick={() => setMode("overunder")}
              >
                Over/Under
              </button>
            </div>
          </div>

          {["matchesdiffers", "overunder"].includes(mode) && (
            <div className="predictBox">
              <h3>Prediction digit</h3>
              <div className="predictDigits">
                {[0,1,2,3,4,5,6,7,8,9].map((n) => (
                  <button
                    key={n}
                    className={prediction === n ? "active" : ""}
                    onClick={() => setPrediction(n)}
                  >
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
            {buttons().map((b, i) => (
              <button
                key={b}
                onClick={() => buy(b)}
                className={i === 0 ? "buyBtn green" : "buyBtn red"}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                <span>Payout {(stake * PAYOUTS[b]).toFixed(2)} USD</span>
              </button>
            ))}
          </div>

          <div className="positions">
            <h2>Open trades</h2>
            {openTrades.map((t) => (
              <div className="tradeCard open" key={t.id}>
                <b>{t.type.toUpperCase()}</b>
                <span>Stake: {t.stake} USD</span>
                <span>Ticks left: {t.ticksLeft}</span>
              </div>
            ))}

            <h2>Trade history</h2>
            {history.map((t) => (
              <div key={t.id} className={t.result === "WON" ? "tradeCard won" : "tradeCard lost"}>
                <b>{t.type.toUpperCase()} — {t.result}</b>
                <span>Exit digit: {t.exitDigit}</span>
                <span>Profit: {t.profit.toFixed(2)} USD</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
