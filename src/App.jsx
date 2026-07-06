import { useEffect, useState } from "react";

const API_URL = "https://metabinary-3.onrender.com";

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
  const [page, setPage] = useState("trade");

  const [email, setEmail] = useState("john2026mainakasongo@gmail.com");
  const [account, setAccount] = useState("Real");

  const [realBalance, setRealBalance] = useState(0);
  const [demoBalance, setDemoBalance] = useState(10000);

  const [depositPhone, setDepositPhone] = useState("254757610718");
  const [depositAmount, setDepositAmount] = useState(10);
  const [depositLoading, setDepositLoading] = useState(false);

  const [price, setPrice] = useState(819.75);
  const [lastDigit, setLastDigit] = useState(7);

  const [mode, setMode] = useState("risefall");
  const [prediction, setPrediction] = useState(7);
  const [duration, setDuration] = useState(5);
  const [stake, setStake] = useState(10);

  const [openTrades, setOpenTrades] = useState([]);
  const [history, setHistory] = useState([]);

  const percentages = [9.9, 11.3, 9.3, 11.9, 11.2, 8.1, 11.4, 10.1, 9.9, 10.7];

  const balance = account === "Real" ? realBalance : demoBalance;

  useEffect(() => {
    loadUser();
  }, [email]);

  async function loadUser() {
    if (!email.includes("@")) return;

    try {
      const res = await fetch(`${API_URL}/api/user/${email}`);
      const data = await res.json();

      if (data.success && data.user) {
        setRealBalance(Number(data.user.realBalance || 0));
        setDemoBalance(Number(data.user.demoBalance || 10000));
      }
    } catch {
      console.log("Backend not reachable");
    }
  }

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
      if (trade.account === "Real") {
        setRealBalance((b) => Number((b + returned).toFixed(2)));
      } else {
        setDemoBalance((b) => Number((b + returned).toFixed(2)));
      }
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
      account,
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

    if (account === "Real") {
      setRealBalance((b) => Number((b - stake).toFixed(2)));
    } else {
      setDemoBalance((b) => Number((b - stake).toFixed(2)));
    }

    setOpenTrades((t) => [trade, ...t]);
  }

  async function handleDeposit() {
    if (!email.includes("@")) {
      alert("Enter a valid email address");
      return;
    }

    if (!depositPhone || depositPhone.length < 10) {
      alert("Enter valid M-Pesa phone number");
      return;
    }

    if (!depositAmount || Number(depositAmount) <= 0) {
      alert("Enter valid deposit amount");
      return;
    }

    setDepositLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone: depositPhone,
          amount: Number(depositAmount),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Deposit failed");
        return;
      }

      setRealBalance(Number(data.user.realBalance || 0));
      setDemoBalance(Number(data.user.demoBalance || 10000));

      alert("Deposit successful. Balance updated.");
      setPage("trade");
    } catch (error) {
      console.log(error);
      alert("Deposit failed. Check backend URL.");
    } finally {
      setDepositLoading(false);
    }
  }

  function menuGo(nextPage) {
    setPage(nextPage);
    setMenuOpen(false);
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

        button,select,input{
          font:inherit;
        }

        button{
          cursor:pointer;
        }

        .app{
          width:100%;
          min-height:100vh;
          background:#f2f2f2;
          color:#111;
          overflow-x:hidden;
        }

        .top{
          height:82px;
          background:white;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 20px;
          gap:14px;
        }

        .accountBox{
          height:52px;
          min-width:178px;
          border:2px solid #111;
          border-radius:18px;
          display:flex;
          align-items:center;
          gap:8px;
          padding:0 12px;
          background:white;
        }

        .flag{
          font-size:21px;
        }

        .account{
          border:none;
          outline:none;
          background:white;
          font-size:18px;
          font-weight:900;
          color:#111;
          width:100%;
        }

        .wallet{
          min-width:150px;
          height:52px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid #ddd;
          border-radius:18px;
          background:white;
          color:#19b8aa;
          font-size:25px;
          font-weight:900;
        }

        .nav{
          height:62px;
          background:#07111d;
          display:grid;
          grid-template-columns:74px repeat(4,1fr);
          position:relative;
          z-index:50;
        }

        .menuBtn,
        .nav button{
          border:none;
          background:#07111d;
          color:white;
          font-weight:900;
        }

        .menuBtn{
          font-size:25px;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .nav button{
          font-size:14px;
        }

        .nav .active{
          background:#19b8aa;
        }

        .drawerOverlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.45);
          z-index:500;
        }

        .drawer{
          position:fixed;
          left:0;
          top:0;
          width:280px;
          height:100vh;
          background:white;
          z-index:600;
          padding:22px;
          box-shadow:10px 0 30px rgba(0,0,0,.25);
        }

        .drawer h2{
          color:#19b8aa;
          font-size:30px;
          margin-bottom:18px;
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
          margin:14px 20px;
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
          font-size:25px;
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
          width:64px;
          height:64px;
          min-width:64px;
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
          margin:0 20px 16px;
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:14px 16px;
          justify-items:center;
        }

        .digit{
          width:58px;
          height:58px;
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

        .panel,
        .prediction,
        .pageBox{
          background:white;
          margin:0 20px 14px;
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
          height:56px;
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
          margin:0 20px 12px;
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
          margin:16px 20px 14px;
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
          padding:10px 20px 28px;
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

        .pageBox h1{
          font-size:30px;
          margin-bottom:12px;
        }

        .pageBox p{
          color:#666;
          margin-bottom:18px;
        }

        .pageBox label{
          display:block;
          font-weight:900;
          margin:12px 0 6px;
        }

        .pageBox input{
          width:100%;
          height:56px;
          border:1px solid #ddd;
          border-radius:14px;
          padding:0 14px;
          font-size:18px;
        }

        .mainBtn{
          width:100%;
          height:58px;
          border:none;
          border-radius:16px;
          background:#19b8aa;
          color:white;
          font-size:20px;
          font-weight:900;
          margin-top:14px;
        }

        .backBtn{
          width:100%;
          height:52px;
          border:none;
          border-radius:14px;
          background:#07111d;
          color:white;
          font-weight:900;
          margin-top:12px;
        }

        @media(max-width:430px){
          .top{
            height:84px;
            padding:0 20px;
          }

          .accountBox{
            min-width:178px;
            height:52px;
          }

          .wallet{
            min-width:150px;
            font-size:24px;
          }

          .nav{
            grid-template-columns:74px repeat(4,1fr);
          }

          .nav button{
            font-size:13px;
          }

          .market{
            margin:14px 20px;
          }

          .market h1{
            font-size:24px;
          }

          .digit{
            width:58px;
            height:58px;
            font-size:23px;
          }

          .buyBtn{
            font-size:30px;
          }
        }

        @media(max-width:370px){
          .top{
            padding:0 12px;
          }

          .accountBox{
            min-width:135px;
          }

          .wallet{
            min-width:112px;
            font-size:21px;
          }

          .nav{
            grid-template-columns:54px repeat(4,1fr);
          }

          .nav button{
            font-size:11px;
          }

          .market,
          .panel,
          .prediction,
          .pageBox,
          .control,
          .buyGrid{
            margin-left:12px;
            margin-right:12px;
          }

          .digit{
            width:48px;
            height:48px;
            font-size:19px;
          }

          .buyBtn{
            font-size:24px;
          }
        }
      `}</style>

      {menuOpen && (
        <>
          <div className="drawerOverlay" onClick={() => setMenuOpen(false)}></div>

          <div className="drawer">
            <h2>MetaBinary</h2>
            <button onClick={() => menuGo("trade")}>Trade</button>
            <button onClick={() => menuGo("deposit")}>Deposit</button>
            <button onClick={() => menuGo("withdraw")}>Withdraw</button>
            <button onClick={() => menuGo("transactions")}>Transactions</button>
            <button onClick={() => menuGo("settings")}>Settings</button>
            <button onClick={() => alert("Logout coming soon")}>Logout</button>
          </div>
        </>
      )}

      <div className="app">
        <div className="top">
          <div className="accountBox">
            {account === "Real" && <span className="flag">🇺🇸</span>}

            <select
              className="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              <option>Real</option>
              <option>Demo</option>
            </select>
          </div>

          <div className="wallet">${balance.toFixed(2)}</div>
        </div>

        <div className="nav">
          <button className="menuBtn" type="button" onClick={() => setMenuOpen(true)}>
            ☰
          </button>

          <button
            className={page === "trade" ? "active" : ""}
            onClick={() => setPage("trade")}
          >
            Trade
          </button>

          <button onClick={() => setPage("charts")}>Charts</button>
          <button onClick={() => setPage("bot")}>Free Bot</button>
          <button onClick={() => setPage("copy")}>Copy Trading</button>
        </div>

        {page === "deposit" && (
          <div className="pageBox">
            <h1>Deposit</h1>
            <p>Send deposit to your Real account.</p>

            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>M-Pesa Phone</label>
            <input
              value={depositPhone}
              onChange={(e) => setDepositPhone(e.target.value)}
              placeholder="2547XXXXXXXX"
            />

            <label>Amount USD</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />

            <button className="mainBtn" onClick={handleDeposit} disabled={depositLoading}>
              {depositLoading ? "Processing..." : "Deposit now"}
            </button>

            <button className="backBtn" onClick={() => setPage("trade")}>
              Back to trading
            </button>
          </div>
        )}

        {page !== "deposit" && page !== "trade" && (
          <div className="pageBox">
            <h1>{page}</h1>
            <p>This section is coming soon.</p>

            <button className="backBtn" onClick={() => setPage("trade")}>
              Back to trading
            </button>
          </div>
        )}

        {page === "trade" && (
          <>
            <div className="market">
              <div>
                <h1>Volatility 100 (1s) Index</h1>
                <p>{price.toFixed(2)} - 0.02 (0.00%)</p>
              </div>

              <div className="last">{lastDigit}</div>
            </div>

            <div className="digits">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <div key={n} className={lastDigit === n ? "digit active" : "digit"}>
                  {n}
                  <span>{percentages[n]}%</span>
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panelTitle">⌄ Select contract type</div>

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
              <div className="prediction">
                <h3>Prediction digit</h3>

                <div className="predictionGrid">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPrediction(n)}
                      className={prediction === n ? "active" : ""}
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
                <button onClick={() => setDuration(Math.max(1, duration - 1))}>
                  −
                </button>

                <b>{duration} ticks</b>

                <button onClick={() => setDuration(duration + 1)}>+</button>
              </div>
            </div>

            <div className="control">
              <h2>Stake</h2>

              <div className="stepper">
                <button onClick={() => setStake(Math.max(1, stake - 1))}>
                  −
                </button>

                <b>{stake} USD</b>

                <button onClick={() => setStake(stake + 1)}>+</button>
              </div>
            </div>

            <div className="buyGrid">
              {buyButtons().map((b, index) => (
                <button
                  key={b}
                  onClick={() => buy(b)}
                  className={index === 0 ? "buyBtn green" : "buyBtn red"}
                >
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
                <div
                  key={t.id}
                  className={t.result === "WON" ? "tradeCard won" : "tradeCard lost"}
                >
                  <b>
                    {t.type.toUpperCase()} — {t.result}
                  </b>
                  <span>Exit digit: {t.exitDigit}</span>
                  <span>Return: {t.returned.toFixed(2)} USD</span>
                  <span>Profit: {t.profit.toFixed(2)} USD</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
