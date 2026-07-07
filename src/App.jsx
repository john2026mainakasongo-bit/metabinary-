import { useEffect, useMemo, useRef, useState } from "react";

const API_URL = "https://metabinary-3.onrender.com";
const DERIV_WS_URL = "wss://ws.derivws.com/websockets/v3?app_id=1089";

const MARKETS = [
  { name: "Meta Volatility 10", symbol: "R_10", subtitle: "Calm synthetic volatility" },
  { name: "Meta Volatility 25", symbol: "R_25", subtitle: "Balanced synthetic volatility" },
  { name: "Meta Volatility 50", symbol: "R_50", subtitle: "Fast synthetic volatility" },
  { name: "Meta Volatility 75", symbol: "R_75", subtitle: "High synthetic volatility" },
  { name: "Meta Volatility 100", symbol: "R_100", subtitle: "Extreme synthetic volatility" },
  { name: "Meta Flash 10", symbol: "1HZ10V", subtitle: "1 second synthetic ticks" },
  { name: "Meta Flash 25", symbol: "1HZ25V", subtitle: "1 second synthetic ticks" },
  { name: "Meta Flash 50", symbol: "1HZ50V", subtitle: "1 second synthetic ticks" },
  { name: "Meta Flash 75", symbol: "1HZ75V", subtitle: "1 second synthetic ticks" },
  { name: "Meta Flash 100", symbol: "1HZ100V", subtitle: "1 second synthetic ticks" },
];

export default function App() {
  const [account, setAccount] = useState("Real");
  const [email] = useState("john2026mainakasongo@gmail.com");
  const [realBalance, setRealBalance] = useState(0);
  const [demoBalance, setDemoBalance] = useState(10000);
  const [menuOpen, setMenuOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositStep, setDepositStep] = useState("methods");
  const [depositPhone, setDepositPhone] = useState("254757610718");
  const [depositAmount, setDepositAmount] = useState(10);
  const [depositLoading, setDepositLoading] = useState(false);

  const [market, setMarket] = useState(MARKETS[4]);
  const [marketOpen, setMarketOpen] = useState(false);
  const [marketStatus, setMarketStatus] = useState("Connecting");
  const [quote, setQuote] = useState(null);
  const [previousQuote, setPreviousQuote] = useState(null);
  const [ticks, setTicks] = useState([]);

  const [tradeType, setTradeType] = useState("Even/Odd");
  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState(5);
  const [selectedDigit, setSelectedDigit] = useState(5);
  const [tradeMessage, setTradeMessage] = useState("");
  const wsRef = useRef(null);

  const balance = account === "Real" ? realBalance : demoBalance;
  const tradeTypes = ["Even/Odd", "Matches/Differs", "Over/Under"];
  const quickAmounts = [10, 25, 50, 100, 250, 500];
  const move = quote !== null && previousQuote !== null ? quote - previousQuote : 0;
  const lastDigit = useMemo(() => {
    if (quote === null) return "-";
    return Number(quote).toFixed(2).replace(".", "").slice(-1);
  }, [quote]);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    connectMarket(market.symbol);
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [market.symbol]);

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

  function connectMarket(symbol) {
    if (wsRef.current) wsRef.current.close();
    setQuote(null);
    setPreviousQuote(null);
    setTicks([]);
    setMarketStatus("Connecting");

    const ws = new WebSocket(DERIV_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setMarketStatus("Live");
      ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setMarketStatus("Market error");
        return;
      }
      if (!data.tick?.quote) return;

      const nextQuote = Number(data.tick.quote);
      setQuote((currentQuote) => {
        if (currentQuote !== null) setPreviousQuote(currentQuote);
        return nextQuote;
      });

      const formatted = nextQuote.toFixed(2);
      const digit = formatted.replace(".", "").slice(-1);
      setTicks((currentTicks) => [
        { quote: formatted, digit },
        ...currentTicks,
      ].slice(0, 24));
    };

    ws.onerror = () => setMarketStatus("Disconnected");
    ws.onclose = () => setMarketStatus("Closed");
  }

  function openDeposit() {
    setAccount("Real");
    setDepositStep("methods");
    setDepositOpen(true);
  }

  async function handleDeposit() {
    try {
      setDepositLoading(true);
      const res = await fetch(`${API_URL}/api/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone: depositPhone, amount: Number(depositAmount) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Deposit failed");
        return;
      }
      await loadUser();
      alert("Deposit successful. Balance updated.");
      setDepositOpen(false);
    } catch (err) {
      console.log(err);
      alert("Deposit failed. Check backend URL.");
    } finally {
      setDepositLoading(false);
    }
  }

  function tradeButtons() {
    if (tradeType === "Even/Odd") return ["Even", "Odd"];
    if (tradeType === "Matches/Differs") return ["Matches", "Differs"];
    return ["Over", "Under"];
  }

  function placeTrade(choice) {
    if (quote === null) {
      setTradeMessage("Waiting for live market price.");
      return;
    }
    const digitText = tradeType === "Even/Odd" ? "" : ` | Digit ${selectedDigit}`;
    setTradeMessage(`${choice} selected | ${tradeType}${digitText} | Stake $${stake} | ${duration} ticks`);
  }

  const [firstButton, secondButton] = tradeButtons();

  return (
    <div className="app">
      <style>{`
        *{box-sizing:border-box}body{margin:0;background:#07111d;font-family:Arial,Helvetica,sans-serif;color:#111}button,input,select{font:inherit}button{cursor:pointer}
        .top{height:84px;background:white;display:flex;align-items:center;justify-content:space-between;padding:0 22px}.accountBox{height:54px;min-width:170px;border:2px solid #111;border-radius:18px;display:flex;align-items:center;gap:8px;padding:0 12px}.accountBox select{border:0;outline:0;font-weight:900;font-size:18px}.wallet{min-width:150px;height:54px;border:1px solid #ddd;border-radius:18px;display:grid;place-items:center;color:#19b8aa;font-size:25px;font-weight:900;background:white}
        .nav{height:62px;background:#07111d;display:grid;grid-template-columns:74px repeat(4,1fr);border-bottom:1px solid rgba(255,255,255,.08)}.nav button{border:0;background:#07111d;color:white;font-weight:900}.nav .active{background:#19b8aa}
        .drawerOverlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:50}.drawer{position:fixed;z-index:60;left:0;top:0;width:280px;height:100vh;background:white;padding:22px;box-shadow:10px 0 30px rgba(0,0,0,.25)}.drawer h2{color:#19b8aa}.drawer button{width:100%;padding:14px;margin-bottom:10px;border:0;border-radius:12px;background:#f2f2f2;font-weight:900;text-align:left}
        .layout{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;padding:16px}.chartArea{background:#0d1a2b;border-radius:20px;padding:16px;min-height:590px;color:white}.marketCard{position:relative;background:#111f34;border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:16px;display:flex;justify-content:space-between;gap:16px}.marketTitle{display:flex;gap:12px}.marketIcon{width:48px;height:48px;border-radius:14px;background:#19b8aa;display:grid;place-items:center;font-weight:900}.marketCard h1{font-size:24px;margin:0}.marketCard p{color:#9da8b8;margin:6px 0}.marketSwitch{border:1px solid rgba(255,255,255,.12);background:#172943;color:white;border-radius:12px;padding:10px 13px;font-weight:900}.marketMenu{position:absolute;left:16px;top:112px;width:min(380px,calc(100vw - 64px));background:#192538;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:10px;z-index:20}.marketMenu button{width:100%;border:0;background:transparent;color:white;text-align:left;padding:12px;border-radius:12px}.marketMenu button:hover,.marketMenu .selected{background:#27384f}.marketMenu span{display:block;color:#9da8b8;font-size:13px;margin-top:4px}
        .live{display:inline-flex;align-items:center;gap:8px;color:#2ef2a2;font-weight:900}.dot{width:9px;height:9px;border-radius:50%;background:#2ef2a2;box-shadow:0 0 14px #2ef2a2}.quoteBox{text-align:right}.quoteBox strong{display:block;font-size:34px}.quoteBox span{display:block;color:#2ef2a2;font-weight:900}.quoteBox .down{color:#ff4057}.lastDigit{width:68px;height:68px;border-radius:50%;background:#19b8aa;display:grid;place-items:center;font-size:34px;font-weight:900;margin-left:auto;margin-top:10px}
        .chartBox{height:340px;background:linear-gradient(180deg,#10213a,#07111d);border-radius:18px;margin-top:18px;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.06)}.chartGrid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:70px 70px}.chartLine{position:absolute;left:-10%;right:-10%;top:50%;height:4px;background:#2ef2a2;box-shadow:0 0 25px #2ef2a2;animation:wave 2s infinite linear}.pricePulse{position:absolute;right:34px;top:38%;width:64px;height:64px;border-radius:50%;background:#19b8aa;display:grid;place-items:center;font-size:28px;font-weight:900}@keyframes wave{0%,100%{transform:translateY(0)}25%{transform:translateY(-34px)}50%{transform:translateY(24px)}75%{transform:translateY(-14px)}}
        .tickGrid{display:grid;grid-template-columns:repeat(12,1fr);gap:8px;margin-top:18px}.tick{background:#142238;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:10px;text-align:center}.tick b{display:block;font-size:22px;color:#2ef2a2}.tick span{display:block;font-size:11px;color:#9da8b8;margin-top:4px}
        .tradePanel{background:white;border-radius:20px;padding:18px;height:fit-content;position:sticky;top:16px}.tradePanel h2{margin:0 0 14px}.tradeSelector{display:grid;gap:10px}.tradeSelector button{border:1px solid #ddd;background:#f1f3f6;border-radius:13px;padding:13px;font-weight:900;text-align:left}.tradeSelector .active{background:#19b8aa;color:white;border-color:#19b8aa}.tradeRow{margin-top:14px}.tradeRow label{display:block;font-weight:900;margin-bottom:7px}.stepper{display:grid;grid-template-columns:46px 1fr 46px;border:1px solid #ddd;border-radius:13px;overflow:hidden}.stepper button{border:0;background:#f1f3f6;font-size:22px;font-weight:900}.stepper b{display:grid;place-items:center;min-height:48px}.digits{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.digits button{height:42px;border-radius:50%;border:1px solid #ddd;background:#f1f3f6;font-weight:900}.digits .active{background:#ff4057;color:white;border-color:#ff4057}.tradeActions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}.tradeActions button{height:78px;border:0;border-radius:16px;color:white;font-size:19px;font-weight:900}.primaryTrade{background:#19b8aa}.secondaryTrade{background:#ff4057}.tradeMessage{margin-top:14px;background:#f4f6f8;border-radius:12px;padding:12px;font-weight:800}
        .depositOverlay{position:fixed;inset:0;background:rgba(4,10,18,.78);backdrop-filter:blur(7px);z-index:100;display:grid;place-items:center;padding:18px}.depositModal{width:min(672px,100%);background:#1f293a;color:white;border-radius:22px;overflow:hidden}.depositHeader{padding:28px 32px;display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.08)}.depositHeader h2{margin:0 0 9px;font-size:30px}.depositHeader p{margin:0;color:#a8b2c2;font-size:20px}.closeDeposit{border:0;background:transparent;color:#7f8999;font-size:42px}.depositBody{padding:30px 32px}.paymentMethod{width:100%;min-height:100px;border:1px solid rgba(255,255,255,.07);border-radius:18px;background:#273345;color:white;display:grid;grid-template-columns:72px 1fr 34px;gap:24px;align-items:center;padding:20px;margin-bottom:18px;text-align:left}.methodIcon{width:72px;height:72px;border-radius:20px;display:grid;place-items:center;font-weight:900}.mpesaIcon{background:#2e7580}.cardIcon{background:#46357b}.usdtIcon{background:#57401f}.methodText strong{display:block;font-size:24px}.methodText span{color:#a8b2c2}.modalLabel{display:block;color:#a8b2c2;font-size:20px;font-weight:900;margin:18px 0 12px}.amountInputWrap,.phoneInput{height:70px;border:1px solid rgba(255,255,255,.1);border-radius:17px;background:#121926;color:white;font-size:26px}.amountInputWrap{display:flex;align-items:center;padding:0 24px;gap:14px}.amountInputWrap input{width:100%;border:0;outline:0;background:transparent;color:white;font-size:26px}.phoneInput{width:100%;padding:0 24px}.quickAmounts{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin:14px 0 24px}.quickAmounts button{height:49px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:#273345;color:#a8b2c2}.quickAmounts .active{color:white;border-color:#4ebdb7;background:#33575d}.hint{color:#778294;margin-top:9px}.depositSubmit{width:100%;height:78px;border:0;border-radius:18px;background:#49b8b5;color:white;font-size:24px;font-weight:900;margin-top:24px}.backLine{border:0;background:transparent;color:#a8b2c2;font-size:20px}
        @media(max-width:900px){.layout{grid-template-columns:1fr;padding:10px}.tradePanel{position:static}.tickGrid{grid-template-columns:repeat(6,1fr)}}@media(max-width:650px){.wallet{min-width:118px;font-size:20px}.nav{grid-template-columns:62px repeat(4,1fr)}.nav button{font-size:12px}.marketCard{flex-direction:column}.quoteBox{text-align:left}.lastDigit{margin-left:0}.tickGrid{grid-template-columns:repeat(3,1fr)}.quickAmounts{grid-template-columns:repeat(3,1fr)}}
      `}</style>

      {menuOpen && (
        <>
          <div className="drawerOverlay" onClick={() => setMenuOpen(false)} />
          <div className="drawer">
            <h2>MetaBinary</h2>
            <button onClick={() => setMenuOpen(false)}>Trade</button>
            <button onClick={() => { openDeposit(); setMenuOpen(false); }}>Deposit</button>
            <button onClick={() => alert("Withdraw coming soon")}>Withdraw</button>
            <button onClick={() => alert("Transactions coming soon")}>Transactions</button>
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
              <button className="closeDeposit" onClick={() => setDepositOpen(false)}>x</button>
            </div>

            {depositStep === "methods" ? (
              <div className="depositBody">
                <button className="paymentMethod" onClick={() => setDepositStep("mpesa")}>
                  <div className="methodIcon mpesaIcon">M</div>
                  <div className="methodText"><strong>M-Pesa</strong><span>Instant mobile money</span></div>
                  <div>&gt;</div>
                </button>
                <button className="paymentMethod" onClick={() => alert("Card deposits coming soon")}>
                  <div className="methodIcon cardIcon">Card</div>
                  <div className="methodText"><strong>Credit/Debit Card</strong><span>Visa, Mastercard</span></div>
                  <div>&gt;</div>
                </button>
                <button className="paymentMethod" onClick={() => alert("USDT deposits coming soon")}>
                  <div className="methodIcon usdtIcon">B</div>
                  <div className="methodText"><strong>USDT (TRC20)</strong><span>Cryptocurrency</span></div>
                  <div>&gt;</div>
                </button>
              </div>
            ) : (
              <div className="depositBody">
                <button className="backLine" onClick={() => setDepositStep("methods")}>{"< Back"}</button>
                <label className="modalLabel">Amount (USD)</label>
                <div className="amountInputWrap">
                  <span>$</span>
                  <input type="number" min="1" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                </div>
                <div className="quickAmounts">
                  {quickAmounts.map((amount) => (
                    <button key={amount} className={Number(depositAmount) === amount ? "active" : ""} onClick={() => setDepositAmount(amount)}>
                      ${amount}
                    </button>
                  ))}
                </div>
                <label className="modalLabel">M-Pesa number</label>
                <input className="phoneInput" value={depositPhone} onChange={(e) => setDepositPhone(e.target.value)} />
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
          <span>US</span>
          <select value={account} onChange={(e) => setAccount(e.target.value)}>
            <option>Real</option>
            <option>Demo</option>
          </select>
        </div>
        <div className="wallet" onClick={openDeposit}>${balance.toFixed(2)}</div>
      </div>

      <div className="nav">
        <button onClick={() => setMenuOpen(true)}>Menu</button>
        <button className="active">Trade</button>
        <button>Charts</button>
        <button>Free Bot</button>
        <button>Copy Trading</button>
      </div>

      <main className="layout">
        <section className="chartArea">
          <div className="marketCard">
            <div>
              <div className="marketTitle">
                <div className="marketIcon">M</div>
                <div>
                  <h1>{market.name}</h1>
                  <p>{market.subtitle}</p>
                  <button className="marketSwitch" onClick={() => setMarketOpen(!marketOpen)}>Change synthetic market</button>
                </div>
              </div>
              <div className="live"><span className="dot" />{marketStatus}</div>
            </div>

            {marketOpen && (
              <div className="marketMenu">
                {MARKETS.map((item) => (
                  <button
                    key={item.symbol}
                    className={item.symbol === market.symbol ? "selected" : ""}
                    onClick={() => {
                      setMarket(item);
                      setMarketOpen(false);
                      setTradeMessage("");
                    }}
                  >
                    <b>{item.name}</b>
                    <span>{item.subtitle}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="quoteBox">
              <strong>{quote === null ? "..." : quote.toFixed(2)}</strong>
              <span className={move < 0 ? "down" : ""}>{move >= 0 ? "+" : ""}{move.toFixed(2)}</span>
              <div className="lastDigit">{lastDigit}</div>
            </div>
          </div>

          <div className="chartBox">
            <div className="chartGrid" />
            <div className="chartLine" />
            <div className="pricePulse">{lastDigit}</div>
          </div>

          <div className="tickGrid">
            {ticks.map((tick, index) => (
              <div className="tick" key={`${tick.quote}-${index}`}>
                <b>{tick.digit}</b>
                <span>{tick.quote}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="tradePanel">
          <h2>Trade Type</h2>
          <div className="tradeSelector">
            {tradeTypes.map((type) => (
              <button key={type} className={tradeType === type ? "active" : ""} onClick={() => { setTradeType(type); setTradeMessage(""); }}>
                {type}
              </button>
            ))}
          </div>

          {tradeType !== "Even/Odd" && (
            <div className="tradeRow">
              <label>Select digit</label>
              <div className="digits">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button key={digit} className={selectedDigit === digit ? "active" : ""} onClick={() => setSelectedDigit(digit)}>
                    {digit}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="tradeRow">
            <label>Duration</label>
            <div className="stepper">
              <button onClick={() => setDuration(Math.max(1, duration - 1))}>-</button>
              <b>{duration} ticks</b>
              <button onClick={() => setDuration(duration + 1)}>+</button>
            </div>
          </div>

          <div className="tradeRow">
            <label>Stake</label>
            <div className="stepper">
              <button onClick={() => setStake(Math.max(1, stake - 1))}>-</button>
              <b>${stake}</b>
              <button onClick={() => setStake(stake + 1)}>+</button>
            </div>
          </div>

          <div className="tradeActions">
            <button className="primaryTrade" onClick={() => placeTrade(firstButton)}>{firstButton}</button>
            <button className="secondaryTrade" onClick={() => placeTrade(secondButton)}>{secondButton}</button>
          </div>

          {tradeMessage && <div className="tradeMessage">{tradeMessage}</div>}
        </aside>
      </main>
    </div>
  );
}
