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
  const [menuOpen, setMenuOpen] = useState(false);
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
          width:100%;
          min-height:100%;
          background:#f2f2f2;
          overflow-x:hidden;
        }

        button,select{
          font:inherit;
        }

        .app{
          width:100%;
          min-height:100vh;
          background:#f2f2f2;
          color:#111;
          overflow-x:hidden;
        }

        .top{
          height:76px;
          background:white;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 18px;
        }

        .menuBtn{
          width:48px;
          height:48px;
          border:none;
          background:white;
          font-size:38px;
          font-weight:900;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
        }

        .accountBox{
          height:52px;
          min-width:146px;
          border:2px solid #111;
          border-radius:17px;
          display:flex;
          align-items:center;
          gap:8px;
          padding:0 12px;
          background:white;
        }

        .flag{
          font-size:20px;
        }

        .account{
          border:none;
          outline:none;
          background:white;
          font-size:18px;
          font-weight:900;
          flex:1;
          color:#111;
        }

        .wallet{
          min-width:124px;
          height:52px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid #ddd;
          border-radius:17px;
          background:white;
          color:#19b8aa;
          font-size:24px;
          font-weight:900;
        }

        .tabs{
          height:58px;
          display:grid;
          grid-template-columns:repeat(4,1fr);
          background:#07111d;
        }

        .tabs button{
          border:none;
          background:#07111d;
          color:white;
          font-size:15px;
          font-weight:900;
        }

        .tabs .active{
          background:#19b8aa;
        }

        .drawerOverlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.45);
          z-index:100;
          display:${menuOpen ? "block" : "none"};
        }

        .drawer{
          position:fixed;
          left:${menuOpen ? "0" : "-280px"};
          top:0;
          width:270px;
          height:100vh;
          background:white;
          z-index:101;
          transition:.25s ease;
          padding:22px;
          box-shadow:10px 0 30px rgba(0,0,0,.2);
        }

        .drawer h2{
          color:#19b8aa;
          font-size:28px;
          margin-bottom:20px;
        }

        .drawer button{
          width:100%;
          padding:14px;
          margin-bottom:10px;
          border:none;
          border-radius:12px;
          background:#f2f2f2;
          text-align:left;
          font-weight:900;
          color:#111;
        }

        .market{
          margin:14px 18px;
          background:white;
          border:1px solid #ddd;
          border-radius:22px;
          padding:18px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
        }

        .market h1{
          font-size:24px;
          line-height:1.1;
          font-weight:900;
        }

        .market p{
          margin-top:6px;
          color:#19b8aa;
          font-size:17px;
          font-weight:900;
        }

        .last{
          width:62px;
          height:62px;
          min-width:62px;
          border-radius:50%;
          background:#19b8aa;
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:31px;
          font-weight:900;
        }

        .digits{
          margin:0 22px 16px;
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:13px 16px;
          justify-items:center;
        }

        .digit{
          width:56px;
          height:56px;
          border-radius:50%;
          border:6px solid #e9edf3;
          background:white;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          font-weight:900;
          font-size:23px;
        }

        .digit span{
          font-size:11px;
          color:#8c95a1;
        }

        .digit.active{
          border-color:#19b8aa;
        }

        .panel{
          background:white;
          margin:0 18px 14px;
          padding:18px 15px;
          border-radius:22px;
        }

        .panelTitle{
          color:#9aa3ae;
          font-size:17px;
          margin-bottom:14px;
        }

        .contractGrid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
        }

        .contractGrid button{
          height:54px;
          border-radius:15px;
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
          margin:0 18px 14px;
          padding:15px;
          border-radius:22px;
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
          height:42px;
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
          height:66px;
          margin:0 18px 12px;
          padding:0 20px;
          background:white;
          border-radius:19px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .control h2{
          font-size:20px;
          font-weight:900;
        }

        .stepper{
          display:flex;
          align-items:center;
          gap:13px;
          font-size:21px;
          font-weight:900;
        }

        .stepper button{
          width:38px;
          height:38px;
          border:none;
          border-radius:50%;
          background:#edf0f4;
          color:#111;
          font-size:25px;
          font-weight:900;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .buyGrid{
          margin:16px 18px 14px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:13px;
        }

        .buyBtn{
          height:94px;
          border:none;
          border-radius:21px;
          color:white;
          font-size:30px;
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
          padding:10px 18px 28px;
        }

        .positions h2{
          font-size:21px;
          margin:12px 0 8px;
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

          .accountBox{
            min-width:122px;
          }

          .wallet{
            min-width:102px;
            font-size:21px;
          }

          .tabs button{
            font-size:12px;
          }

          .market h1{
            font-size:21px;
          }

          .digit{
            width:49px;
            height:49px;
            font-size:20px;
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

      <div className="drawerOverlay" onClick={() => setMenuOpen(false)}></div>

      <div className="drawer">
        <h2>MetaBinary</h2>
        <button onClick={() => setMenuOpen(false)}>Trade</button>
        <button onClick={() => setMenuOpen(false)}>Deposit</button>
        <button onClick={() => setMenuOpen(false)}>Withdraw</button>
        <button onClick={() => setMenuOpen(false)}>Transactions</button>
        <button onClick={() => setMenuOpen(false)}>Settings</button>
        <button onClick={() => setMenuOpen(false)}>Logout</button>
      </div>

      <div className="app">
        <div className="top">
          <button className="menuBtn" onClick={() => setMenuOpen(true)}>
            ☰
          </button>

          <div className="accountBox">
            <span className="flag">🇺🇸</span>
            <select className="account" value={account} onChange={(e) => setAccount(e.target.value)}>
              <option>Real</option>
              <option>Demo</option>
            </select>
          </div>

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
