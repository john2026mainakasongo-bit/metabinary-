import { useEffect, useState } from "react";

const API_URL = "https://metabinary-3.onrender.com";

export default function App() {
  const [page, setPage] = useState("trade");
  const [menuOpen, setMenuOpen] = useState(false);

  const [account, setAccount] = useState("Real");
  const [email, setEmail] = useState("john2026mainakasongo@gmail.com");

  const [realBalance, setRealBalance] = useState(0);
  const [demoBalance, setDemoBalance] = useState(10000);

  const [depositPhone, setDepositPhone] = useState("254757610718");
  const [depositAmount, setDepositAmount] = useState(10);
  const [depositLoading, setDepositLoading] = useState(false);

  const balance = account === "Real" ? realBalance : demoBalance;

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const res = await fetch(`${API_URL}/api/user/${email}`);
      const data = await res.json();

      setRealBalance(Number(data.realBalance || data.user?.realBalance || 0));
      setDemoBalance(Number(data.demoBalance || data.user?.demoBalance || 10000));
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeposit() {
    try {
      setDepositLoading(true);

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

      if (!res.ok || !data.success) {
        alert(data.message || "Deposit failed");
        return;
      }

      const newBalance =
        data.balance ??
        data.realBalance ??
        data.user?.realBalance ??
        data.user?.balance ??
        0;

      setRealBalance(Number(newBalance));

      alert("Deposit successful. Balance updated.");
      setPage("trade");
    } catch (err) {
      console.log(err);
      alert("Deposit failed. Check backend URL.");
    } finally {
      setDepositLoading(false);
    }
  }

  return (
    <div className="app">
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial,Helvetica,sans-serif;
        }

        body{
          background:#f2f2f2;
          color:#111;
        }

        .app{
          min-height:100vh;
          background:#f2f2f2;
        }

        .top{
          height:84px;
          background:white;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 22px;
        }

        .accountBox{
          height:54px;
          min-width:178px;
          border:2px solid #111;
          border-radius:18px;
          display:flex;
          align-items:center;
          gap:8px;
          padding:0 12px;
          background:white;
        }

        .accountBox span{
          font-size:21px;
        }

        .accountBox select{
          border:none;
          outline:none;
          background:white;
          font-size:18px;
          font-weight:900;
          width:100%;
        }

        .wallet{
          min-width:150px;
          height:54px;
          border:1px solid #ddd;
          border-radius:18px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#19b8aa;
          font-size:25px;
          font-weight:900;
          background:white;
        }

        .nav{
          height:62px;
          background:#07111d;
          display:grid;
          grid-template-columns:74px repeat(4,1fr);
        }

        .nav button{
          border:none;
          background:#07111d;
          color:white;
          font-weight:900;
          font-size:14px;
        }

        .nav button.active{
          background:#19b8aa;
        }

        .menuBtn{
          font-size:25px!important;
        }

        .drawerOverlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.45);
          z-index:50;
        }

        .drawer{
          position:fixed;
          left:0;
          top:0;
          width:280px;
          height:100vh;
          background:white;
          z-index:60;
          padding:22px;
          box-shadow:10px 0 30px rgba(0,0,0,.25);
        }

        .drawer h2{
          color:#19b8aa;
          margin-bottom:18px;
          font-size:30px;
        }

        .drawer button{
          width:100%;
          padding:14px;
          margin-bottom:10px;
          border:none;
          border-radius:12px;
          background:#f2f2f2;
          color:#111;
          font-weight:900;
          text-align:left;
        }

        .card{
          margin:16px 20px;
          background:white;
          border-radius:22px;
          padding:18px;
        }

        .card h1{
          font-size:30px;
          margin-bottom:12px;
        }

        .card p{
          color:#666;
          margin-bottom:18px;
        }

        label{
          display:block;
          font-weight:900;
          margin:14px 0 7px;
        }

        input{
          width:100%;
          height:58px;
          border:1px solid #ddd;
          border-radius:14px;
          padding:0 15px;
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
          margin-top:18px;
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

        .market{
          margin:16px 20px;
          background:white;
          border:1px solid #ddd;
          border-radius:22px;
          padding:18px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .market h1{
          font-size:25px;
        }

        .market p{
          color:#19b8aa;
          font-weight:900;
          margin-top:6px;
        }

        .last{
          width:64px;
          height:64px;
          border-radius:50%;
          background:#19b8aa;
          color:white;
          display:grid;
          place-items:center;
          font-size:32px;
          font-weight:900;
        }

        .tradeBtns{
          margin:16px 20px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
        }

        .tradeBtns button{
          height:94px;
          border:none;
          border-radius:22px;
          color:white;
          font-size:30px;
          font-weight:900;
        }

        .rise{
          background:#19b8aa;
        }

        .fall{
          background:#ff4057;
        }
      `}</style>

      {menuOpen && (
        <>
          <div className="drawerOverlay" onClick={() => setMenuOpen(false)} />
          <div className="drawer">
            <h2>MetaBinary</h2>
            <button onClick={() => { setPage("trade"); setMenuOpen(false); }}>Trade</button>
            <button onClick={() => { setPage("deposit"); setMenuOpen(false); }}>Deposit</button>
            <button onClick={() => { alert("Withdraw coming soon"); setMenuOpen(false); }}>Withdraw</button>
            <button onClick={() => { alert("Transactions coming soon"); setMenuOpen(false); }}>Transactions</button>
          </div>
        </>
      )}

      <div className="top">
        <div className="accountBox">
          {account === "Real" && <span>🇺🇸</span>}
          <select value={account} onChange={(e) => setAccount(e.target.value)}>
            <option>Real</option>
            <option>Demo</option>
          </select>
        </div>

        <div className="wallet">${balance.toFixed(2)}</div>
      </div>

      <div className="nav">
        <button className="menuBtn" onClick={() => setMenuOpen(true)}>☰</button>
        <button className={page === "trade" ? "active" : ""} onClick={() => setPage("trade")}>Trade</button>
        <button>Charts</button>
        <button>Free Bot</button>
        <button>Copy Trading</button>
      </div>

      {page === "deposit" ? (
        <div className="card">
          <h1>Deposit</h1>
          <p>Send deposit to your Real account.</p>

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>M-Pesa Phone</label>
          <input value={depositPhone} onChange={(e) => setDepositPhone(e.target.value)} />

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
      ) : (
        <>
          <div className="market">
            <div>
              <h1>Volatility 100 (1s) Index</h1>
              <p>819.75 - 0.02 (0.00%)</p>
            </div>
            <div className="last">7</div>
          </div>

          <div className="tradeBtns">
            <button className="rise">Rise</button>
            <button className="fall">Fall</button>
          </div>
        </>
      )}
    </div>
  );
}
