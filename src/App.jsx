import { useEffect, useState } from "react";

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
  const [digit, setDigit] = useState(0);

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
        const last = Number(next.toFixed(2).slice(-1));

        setDigit(last);

        setOpenTrades((trades) =>
          trades.map((t) => ({
            ...t,
            ticksLeft: t.ticksLeft - 1,
            exitPrice: next,
            exitDigit: last,
          }))
        );

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const done = openTrades.filter((t) => t.ticksLeft <= 0);
    if (!done.length) return;

    done.forEach(closeTrade);
    setOpenTrades((trades) => trades.filter((t) => t.ticksLeft > 0));
  }, [openTrades]);

  function checkWin(t) {
    if (t.type === "even") return t.exitDigit % 2 === 0;
    if (t.type === "odd") return t.exitDigit % 2 !== 0;
    if (t.type === "matches") return t.exitDigit === t.prediction;
    if (t.type === "differs") return t.exitDigit !== t.prediction;
    if (t.type === "over") return t.exitDigit > t.prediction;
    if (t.type === "under") return t.exitDigit < t.prediction;
    if (t.type === "rise") return t.exitPrice > t.entryPrice;
    if (t.type === "fall") return t.exitPrice < t.entryPrice;
    return false;
  }

  function closeTrade(trade) {
    const won = checkWin(trade);
    const returned = won ? Number((trade.stake * trade.payout).toFixed(2)) : 0;
    const profit = won ? Number((returned - trade.stake).toFixed(2)) : -trade.stake;

    if (won) setBalance((b) => Number((b + returned).toFixed(2)));

    setHistory((h) => [
      {
        ...trade,
        result: won ? "WON" : "LOST",
        profit,
        returned,
      },
      ...h,
    ]);
  }

  function buy() {
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
      entryDigit: digit,
      exitPrice: price,
      exitDigit: digit,
      ticksLeft: ticks,
    };

    setBalance((b) => Number((b - amount).toFixed(2)));
    setOpenTrades((t) => [trade, ...t]);
  }

  const possiblePayout = Number(stake || 0) * payouts[contract];

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
          background:#07111d;
        }

        body{
          color:white;
        }

        .app{
          min-height:100vh;
          background:#07111d;
        }

        .top{
          background:white;
          color:#111;
          padding:18px 20px;
        }

        .top h1{
          font-size:36px;
          font-weight:900;
        }

        .top p{
          font-size:24px;
          margin-top:10px;
        }

        .main{
          display:grid;
          grid-template-columns:1fr 360px;
          gap:16px;
          padding:16px;
        }

        .chart{
          background:#07111d;
        }

        .market{
          background:#0d1a2b;
          border-radius:18px;
          padding:16px;
          margin-bottom:14px;
        }

        .market h2{
          font-size:28px;
        }

        .market strong{
          display:block;
          font-size:26px;
          margin-top:6px;
          color:#2ef2a2;
        }

        .digits{
          display:flex;
          flex-direction:row;
          flex-wrap:nowrap;
          gap:8px;
          overflow-x:auto;
          padding:8px 0 16px;
        }

        .digit{
          width:44px;
          height:44px;
          min-width:44px;
          border-radius:50%;
          border:1px solid #334761;
          background:#172943;
          color:white;
          font-size:21px;
          font-weight:900;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .digit.active{
          background:#ff444f;
          border-color:#ff444f;
        }

        .chartBox{
          height:300px;
          background:linear-gradient(180deg,#10213a,#07111d);
          border-radius:18px;
          position:relative;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.08);
        }

        .line{
          position:absolute;
          top:50%;
          left:-20%;
          width:140%;
          height:4px;
          background:#2ef2a2;
          box-shadow:0 0 24px #2ef2a2;
          animation:move 2s infinite ease-in-out;
        }

        @keyframes move{
          0%{transform:translateY(0);}
          50%{transform:translateY(-35px);}
          100%{transform:translateY(0);}
        }

        .cursor{
          position:absolute;
          right:24px;
          top:42%;
          width:62px;
          height:62px;
          border-radius:50%;
          background:#ff444f;
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:28px;
          font-weight:900;
        }

        .trade{
          background:white;
          color:#111;
          border-radius:24px;
          padding:28px;
          height:max-content;
        }

        .trade h2{
          font-size:30px;
          margin-bottom:20px;
        }

        .trade label{
          display:block;
          font-size:20px;
          font-weight:900;
          margin:16px 0 8px;
        }

        .trade select,
        .trade input{
          width:100%;
          height:58px;
          border-radius:16px;
          border:1px solid #ddd;
          background:white;
          color:#111;
          padding:0 18px;
          font-size:21px;
          display:block;
        }

        .predict{
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:8px;
        }

        .predict button{
          height:45px;
          border-radius:50%;
          border:1px solid #ddd;
          background:#f1f3f6;
          font-weight:900;
        }

        .predict button.selected{
          background:#ff444f;
          color:white;
          border-color:#ff444f;
        }

        .buy{
          width:100%;
          height:58px;
          margin-top:20px;
          border:none;
          border-radius:16px;
          background:#ff444f;
          color:white;
          font-size:21px;
          font-weight:900;
        }

        .payout{
          margin-top:12px;
          font-size:19px;
          color:#111;
        }

        .bottom{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:16px;
          padding:0 16px 16px;
        }

        .box{
          background:#0d1a2b;
          border-radius:18px;
          padding:16px;
        }

        .box h2{
          font-size:26px;
          margin-bottom:10px;
        }

        .card{
          margin-top:10px;
          background:#101f35;
          border-radius:14px;
          padding:14px;
          display:flex;
          flex-direction:column;
          gap:4px;
        }

        .open{border-left:5px solid #ffc107;}
        .won{border-left:5px solid #2ef2a2;}
        .lost{border-left:5px solid #ff444f;}

        @media(max-width:850px){
          .main{
            display:flex;
            flex-direction:column;
            padding:0;
            gap:0;
          }

          .chart{
            padding:0 0 18px;
          }

          .market{
            border-radius:0;
            margin-bottom:0;
          }

          .digits{
            padding:12px 8px;
          }

          .chartBox{
            height:280px;
            border-radius:0;
          }

          .trade{
            width:100%;
            border-radius:28px 28px 0 0;
            padding:30px;
          }

          .bottom{
            display:flex;
            flex-direction:column;
            padding:0;
            gap:0;
          }

          .box{
            border-radius:0;
          }
        }
      `}</style>

      <div className="app">
        <header className="top">
          <h1>MetaBinary</h1>
          <p>USD {balance.toFixed(2)}</p>
        </header>

        <main className="main">
          <section className="chart">
            <div className="market">
              <h2>Volatility 100 Index</h2>
              <strong>{price.toFixed(2)}</strong>
            </div>

            <div className="digits">
              {[0,1,2,3,4,5,6,7,8,9].map((n) => (
                <button key={n} className={digit === n ? "digit active" : "digit"}>
                  {n}
                </button>
              ))}
            </div>

            <div className="chartBox">
              <div className="line"></div>
              <div className="cursor">{digit}</div>
            </div>
          </section>

          <section className="trade">
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
                <div className="predict">
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

            <button className="buy" onClick={buy}>Buy contract</button>

            <p className="payout">
              Possible payout: USD {possiblePayout.toFixed(2)}
            </p>
          </section>
        </main>

        <section className="bottom">
          <div className="box">
            <h2>Open trades</h2>
            {openTrades.map((t) => (
              <div className="card open" key={t.id}>
                <b>{t.type.toUpperCase()}</b>
                <span>Stake: USD {t.stake}</span>
                <span>Ticks left: {t.ticksLeft}</span>
              </div>
            ))}
          </div>

          <div className="box">
            <h2>Trade history</h2>
            {history.map((t) => (
              <div className={t.result === "WON" ? "card won" : "card lost"} key={t.id}>
                <b>{t.type.toUpperCase()} - {t.result}</b>
                <span>Exit digit: {t.exitDigit}</span>
                <span>Profit: USD {t.profit.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
