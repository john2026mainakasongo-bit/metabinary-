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
  const [menuOpen, setMenuOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositStep, setDepositStep] = useState("methods");
  const [marketMenuOpen, setMarketMenuOpen] = useState(false);

  const [account, setAccount] = useState("Real");
  const [email] = useState("john2026mainakasongo@gmail.com");
  const [realBalance, setRealBalance] = useState(0);
  const [demoBalance, setDemoBalance] = useState(10000);

  const [depositPhone, setDepositPhone] = useState("254757610718");
  const [depositAmount, setDepositAmount] = useState(10);
  const [depositLoading, setDepositLoading] = useState(false);

  const [market, setMarket] = useState(MARKETS[4]);
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
  const quickAmounts = [10, 25, 50, 100, 250, 500];
  const tradeTypes = ["Even/Odd", "Matches/Differs", "Over/Under"];
  const balance = account === "Real" ? realBalance : demoBalance;

  const lastDigit = useMemo(() => {
    if (quote === null) return "-";
    const text = Number(quote).toFixed(2).replace(".", "");
    return text[text.length - 1];
  }, [quote]);

  const marketMove = quote !== null && previousQuote !== null ? quote - previousQuote : 0;

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    connectLiveMarket(market.symbol);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [market]);

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

  function connectLiveMarket(symbol) {
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
