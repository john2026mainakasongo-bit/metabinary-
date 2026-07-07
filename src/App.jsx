import { useEffect, useState } from "react";

const API_URL = "https://metabinary-3.onrender.com";

export default function App() {
  const [page, setPage] = useState("trade");
  const [menuOpen, setMenuOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositStep, setDepositStep] = useState("methods");

  const [account, setAccount] = useState("Real");
  const [email, setEmail] = useState("john2026mainakasongo@gmail.com");

  const [realBalance, setRealBalance] = useState(0);
  const [demoBalance, setDemoBalance] = useState(10000);

  const [depositPhone, setDepositPhone] = useState("254757610718");
  const [depositAmount, setDepositAmount] = useState(10);
  const [depositLoading, setDepositLoading] = useState(false);

  const quickAmounts = [10, 25, 50, 100, 250, 500];
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

  function openDepositModal() {
    setAccount("Real");
    setDepositStep("methods");
    setDepositOpen(true);
  }

  function closeDepositModal() {
    if (depositLoading) return;
    setDepositOpen(false);
    setDepositStep("methods");
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

      await loadUser();
      alert("Deposit successful. Balance updated.");
      closeDepositModal();
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
        *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}
        body{background:#f2f2f2;color:#111}
        .app{min-height:100vh;background:#f2f2f2}
        .top{height:84px;background:white;display:flex;align-items:center;justify-content:space-between;padding:0 22px}
        .accountBox{height:54px;min-width:178px;border:2px solid #111;border-radius:18px;display:flex;align-items:center;gap:8px;padding:0 12px;background:white}
        .accountBox span{font-size:14px;font-weight:900}
        .accountBox select{border:none;outline:none;background:white;font-size:18px;font-weight:900;width:100%}
        .wallet{min-width:150px;height:54px;border:1px solid #ddd;border-radius:18px;display:flex;align-items:center;justify-content:center;color:#19b8aa;font-size:25px;font-weight:900;background:white;cursor:pointer}
        .nav{height:62px;background:#07111d;display:grid;grid-template-columns:74px repeat(4,1fr)}
        .nav button{border:none;background:#07111d;color:white;font-weight:900;font-size:14px}
        .nav button.active{background:#19b8aa}
        .menuBtn{font-size:22px!important}
        .drawerOverlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:50}
        .drawer{position:fixed;left:0;top:0;width:280px;height:100vh;background:white;z-index:60;padding:22px;box-shadow:10px 0 30px rgba(0,0,0,.25)}
        .drawer h2{color:#19b8aa;margin-bottom:18px;font-size:30px}
        .drawer button{width:100%;padding:14px;margin-bottom:10px;border:none;border-radius:12px;background:#f2f2f2;color:#111;font-weight:900;text-align:left}
        .market{margin:16px 20px;background:white;border:1px solid #ddd;border-radius:22px;padding:18px;display:flex;justify-content:space-between;align-items:center}
        .market h1{font-size:25px}
        .market p{color:#19b8aa;font-weight:900;margin-top:6px}
        .last{width:64px;height:64px;border-radius:50%;background:#19b8aa;color:white;display:grid;place-items:center;font-size:32px;font-weight:900}
        .tradeBtns{margin:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .tradeBtns button{height:94px;border:none;border-radius:22px;color:white;font-size:30px;font-weight:900}
        .rise{background:#19b8aa}
        .fall{background:#ff4057}

        .depositOverlay{position:fixed;inset:0;background:rgba(4,10,18,.78);backdrop-filter:blur(7px);z-index:100;display:grid;place-items:center;padding:18px}
        .depositModal{width:min(672px,100%);background:#1f293a;color:white;border:1px solid rgba(255,255,255,.08);border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.45);overflow:hidden}
        .depositHeader{min-height:124px;padding:28px 32px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.08)}
        .depositHeader h2{font-size:30px;line-height:1.1;margin-bottom:9px}
        .depositHeader p{color:#a8b2c2;font-size:20px}
        .closeDeposit{border:none;background:transparent;color:#7f8999;font-size:42px;line-height:1;cursor:pointer}
        .depositBody{padding:30px 32px}
        .paymentMethod{width:100%;min-height:122px;border:1px solid rgba(255,255,255,.07);border-radius:18px;background:#273345;color:white;display:grid;grid-template-columns:72px 1fr 34px;gap:24px;align-items:center;padding:24px;margin-bottom:18px;text-align:left;cursor:pointer}
        .paymentMethod:hover{background:#303d50}
        .methodIcon{width:72px;height:72px;border-radius:20px;display:grid;place-items:center;font-size:28px;font-weight:900}
        .mpesaIcon{background:#2e7580;color:#6ff1ee}
        .cardIcon{background:#46357b;color:#a66dff}
        .usdtIcon{background:#57401f;color:#ffad1f}
        .methodText strong{display:block;font-size:25px;margin-bottom:8px}
        .methodText span{color:#a8b2c2;font-size:20px}
        .methodArrow{color:#7f8999;font-size:42px}
        .backLine{border:none;background:transparent;color:#a8b2c2;font-size:21px;margin-bottom:28px;cursor:pointer}
        .modalLabel{display:block;color:#a8b2c2;font-size:20px;font-weight:900;margin:18px 0 12px}
        .amountInputWrap{height:74px;border:1px solid rgba(255,255,255,.1);border-radius:17px;background:#121926;display:flex;align-items:center;padding:0 24px;gap:14px}
        .amountInputWrap span{color:#8f99aa;font-size:26px}
        .amountInputWrap input,.phoneInput{width:100%;border:none;outline:none;color:white;background:transparent;font-size:26px}
        .quickAmounts{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin:14px 0 26px}
        .quickAmounts button{height:49px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:#273345;color:#a8b2c2;font-size:21px;cursor:pointer}
        .quickAmounts button.active{color:white;border-color:#4ebdb7;background:#33575d}
        .phoneInput{height:74px;border:1px solid rgba(255,255,255,.1);border-radius:17px;background:#121926;padding:0 24px}
        .hint{color:#778294;font-size:17px;margin-top:9px}
        .depositSubmit{width:100%;height:85px;border:none;border-radius:18px;background:#49b8b5;color:white;font-size:25px;font-weight:900;margin-top:26px;cursor:pointer}
        .depositSubmit:disabled{opacity:.65;cursor:not-allowed}

        @media (max-width:700px){
          .depositHeader{padding:24px}
          .depositBody{padding:24px}
          .quickAmounts{grid-template-columns:repeat(3,1fr)}
          .paymentMethod{grid-template-columns:58px 1fr 28px;gap:16px;padding:18px}
          .methodIcon{width:58px;height:58px;font-size:24px}
          .methodText strong{font-size:21px}
          .methodText span{font-size:17px}
        }
      `}</style>

      {menuOpen && (
        <>
          <div className="drawerOverlay" onClick={() => setMenuOpen(false)} />
          <div className="drawer">
            <h2>MetaBinary</h2>
            <button onClick={() => { setPage("trade"); setMenuOpen(false); }}>Trade</button>
            <button onClick={() => { openDepositModal(); setMenuOpen(false); }}>Deposit</button>
            <button onClick={() => { alert("Withdraw coming soon"); setMenuOpen(false); }}>Withdraw</button>
            <button onClick={() => { alert("Transactions coming soon"); setMenuOpen(false); }}>Transactions</button>
          </div>
        </>
      )}

      {depositOpen && (
        <div className="depositOverlay">
          <div className="depositModal">
            <div className="depositHeader">
              <div>
                <h2>Deposit Funds</h2>
                <p>Choose payment method</p>
              </div>
              <button className="closeDeposit" onClick={closeDepositModal}>x</button>
            </div>

            {depositStep === "methods" ? (
              <div className="depositBody">
                <button className="paymentMethod" onClick={() => setDepositStep("mpesa")}>
                  <div className="methodIcon mpesaIcon">M</div>
                  <div className="methodText">
                    <strong>M-Pesa</strong>
                    <span>Instant mobile money</span>
                  </div>
                  <div className="methodArrow">&gt;</div>
                </button>

                <button className="paymentMethod" onClick={() => alert("Card deposits coming soon")}>
                  <div className="methodIcon cardIcon">Card</div>
                  <div className="methodText">
                    <strong>Credit/Debit Card</strong>
                    <span>Visa, Mastercard</span>
                  </div>
                  <div className="methodArrow">&gt;</div>
                </button>

                <button className="paymentMethod" onClick={() => alert("USDT deposits coming soon")}>
                  <div className="methodIcon usdtIcon">B</div>
                  <div className="methodText">
                    <strong>USDT (TRC20)</strong>
                    <span>Cryptocurrency</span>
                  </div>
                  <div className="methodArrow">&gt;</div>
                </button>
              </div>
            ) : (
              <div className="depositBody">
                <button className="backLine" onClick={() => setDepositStep("methods")}>{"< Back"}</button>

                <label className="modalLabel">Amount (USD)</label>
                <div className="amountInputWrap">
                  <span>$</span>
                  <input
                    type="number"
                    min="1"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>

                <div className="quickAmounts">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      className={Number(depositAmount) === amount ? "active" : ""}
                      onClick={() => setDepositAmount(amount)}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <label className="modalLabel">M-Pesa number</label>
                <input
                  className="phoneInput"
                  value={depositPhone}
                  onChange={(e) => setDepositPhone(e.target.value)}
                />
                <div className="hint">Use this format only: 2547XXXXXXXX</div>

                <button className="depositSubmit" onClick={handleDeposit} disabled={depositLoading}>
                  {depositLoading ? "Processing..." : `Deposit $${Number(depositAmount || 0).toFixed(0)}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="top">
        <div className="accountBox">
          {account === "Real" && <span>US</span>}
          <select value={account} onChange={(e) => setAccount(e.target.value)}>
            <option>Real</option>
            <option>Demo</option>
          </select>
        </div>

        <div className="wallet" onClick={openDepositModal}>
          ${balance.toFixed(2)}
        </div>
      </div>

      <div className="nav">
        <button className="menuBtn" onClick={() => setMenuOpen(true)}>Menu</button>
        <button className={page === "trade" ? "active" : ""} onClick={() => setPage("trade")}>Trade</button>
        <button>Charts</button>
        <button>Free Bot</button>
        <button>Copy Trading</button>
      </div>

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
    </div>
  );
}
