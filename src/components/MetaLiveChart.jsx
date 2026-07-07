import { useEffect, useMemo, useRef, useState } from "react";

const DERIV_WS_URL = "wss://ws.derivws.com/websockets/v3?app_id=1089";

export default function MetaLiveChart({
  marketName = "Volatility 10 (1s) Index",
  symbol = "1HZ10V",
}) {
  const [quote, setQuote] = useState(null);
  const [previousQuote, setPreviousQuote] = useState(null);
  const [ticks, setTicks] = useState([]);
  const [status, setStatus] = useState("Connecting");
  const wsRef = useRef(null);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [symbol]);

  function connect() {
    if (wsRef.current) wsRef.current.close();

    setStatus("Connecting");
    setQuote(null);
    setPreviousQuote(null);
    setTicks([]);

    const ws = new WebSocket(DERIV_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("Live");
      ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        setStatus("Market error");
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
        {
          quote: nextQuote,
          formatted,
          digit,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
        ...currentTicks,
      ].slice(0, 60));
    };

    ws.onerror = () => setStatus("Disconnected");
    ws.onclose = () => setStatus("Closed");
  }

  const newestTicks = [...ticks].reverse();
  const move = quote !== null && previousQuote !== null ? quote - previousQuote : 0;
  const movePercent =
    previousQuote && quote ? ((quote - previousQuote) / previousQuote) * 100 : 0;

  const lastDigit = quote === null
    ? "-"
    : Number(quote).toFixed(2).replace(".", "").slice(-1);

  const chart = useMemo(() => {
    if (newestTicks.length < 2) {
      return {
        line: "",
        fill: "",
        min: 0,
        max: 0,
        labels: [],
        currentX: 0,
        currentY: 0,
      };
    }

    const width = 900;
    const height = 520;
    const padding = 24;
    const prices = newestTicks.map((tick) => tick.quote);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = Math.max(max - min, 0.0001);

    const points = newestTicks.map((tick, index) => {
      const x = (index / Math.max(newestTicks.length - 1, 1)) * width;
      const y = padding + ((max - tick.quote) / range) * (height - padding * 2);
      return { x, y };
    });

    const line = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
    const first = points[0];
    const last = points[points.length - 1];
    const fill = `0,${height} ${first.x},${first.y} ${line} ${last.x},${height}`;
    const labels = [max, max - range * 0.25, max - range * 0.5, max - range * 0.75, min];

    return {
      line,
      fill,
      min,
      max,
      labels,
      currentX: last.x,
      currentY: last.y,
    };
  }, [ticks]);

  const digitStats = useMemo(() => {
    const total = Math.max(ticks.length, 1);

    return Array.from({ length: 10 }, (_, digit) => {
      const count = ticks.filter((tick) => Number(tick.digit) === digit).length;
      return {
        digit,
        percent: (count / total) * 100,
      };
    });
  }, [ticks]);

  return (
    <section className="metaChart">
      <style>{`
        .metaChart{
          position:relative;
          min-height:640px;
          overflow:hidden;
          background:#141b28;
          border-radius:0;
          color:#f5f7fb;
          border:1px solid rgba(255,255,255,.06);
        }

        .chartGrid{
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size:92px 120px;
        }

        .chartSidebar{
          position:absolute;
          left:0;
          top:0;
          z-index:6;
          width:50px;
          height:100%;
          background:#1b2434;
          border-right:1px solid rgba(255,255,255,.08);
          display:flex;
          flex-direction:column;
          align-items:center;
          padding-top:6px;
          gap:12px;
        }

        .sideTool{
          width:43px;
          height:47px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:7px;
          background:#202b3f;
          color:#9ca8bd;
          display:grid;
          place-items:center;
          font-size:18px;
          font-weight:900;
        }

        .sideTool.active{
          color:#38c8c6;
          background:#25485a;
        }

        .zoomTools{
          margin-top:auto;
          margin-bottom:22px;
          display:flex;
          flex-direction:column;
          gap:7px;
        }

        .chartHeader{
          position:absolute;
          left:60px;
          top:4px;
          z-index:7;
          min-width:344px;
          min-height:80px;
          border-radius:10px;
          background:#202a3d;
          border:1px solid rgba(255,255,255,.08);
          display:flex;
          align-items:center;
          gap:14px;
          padding:14px 18px;
          box-shadow:0 14px 35px rgba(0,0,0,.25);
        }

        .chartHeaderIcon{
          width:40px;
          height:40px;
          border-radius:12px;
          background:#26344c;
          color:#38c8c6;
          display:grid;
          place-items:center;
          font-weight:900;
          font-size:20px;
        }

        .chartHeader h2{
          margin:0;
          font-size:21px;
          line-height:1.05;
          color:#f4f7fb;
        }

        .chartHeader p{
          margin:6px 0 0;
          color:#f4f7fb;
          font-size:16px;
          font-weight:900;
        }

        .chartHeader p span{
          color:#ff4d63;
          margin-left:7px;
        }

        .chartStatus{
          margin-left:auto;
          color:#8b96aa;
          font-size:22px;
        }

        .percentBadge{
          position:absolute;
          right:18px;
          top:4px;
          z-index:7;
          width:76px;
          height:51px;
          border-radius:7px;
          background:#202b3f;
          border:1px solid rgba(255,255,255,.08);
          color:#bfd0ef;
          display:grid;
          place-items:center;
          font-size:18px;
        }

        .liveBadge{
          position:absolute;
          right:18px;
          top:66px;
          z-index:7;
          color:#38c8c6;
          font-size:12px;
          font-weight:900;
        }

        .lineLayer{
          position:absolute;
          left:50px;
          right:86px;
          top:14px;
          bottom:62px;
          z-index:3;
        }

        .lineSvg{
          width:100%;
          height:100%;
          overflow:visible;
        }

        .areaFill{
          fill:rgba(255,255,255,.04);
        }

        .priceLine{
          fill:none;
          stroke:#d5dbe5;
          stroke-width:2.2;
          stroke-linejoin:round;
          stroke-linecap:round;
          filter:drop-shadow(0 0 3px rgba(255,255,255,.14));
        }

        .priceDot{
          fill:#f7fafc;
          stroke:#fff;
          stroke-width:2;
        }

        .priceTag{
          position:absolute;
          right:-78px;
          min-width:87px;
          transform:translateY(-50%);
          background:#172434;
          border:1px solid #38c8c6;
          color:#fff;
          border-radius:5px;
          padding:5px 7px;
          font-size:14px;
          font-weight:900;
          text-align:right;
        }

        .priceTag small{
          display:block;
          color:#a7b1c4;
          font-size:11px;
          margin-top:-2px;
        }

        .rightScale{
          position:absolute;
          right:14px;
          top:130px;
          bottom:118px;
          z-index:4;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          color:#9da7b8;
          font-size:15px;
          text-align:right;
        }

        .digitStrip{
          position:absolute;
          left:100px;
          right:86px;
          bottom:10px;
          z-index:8;
          display:grid;
          grid-template-columns:repeat(10, minmax(58px, 1fr));
          gap:10px;
          align-items:end;
        }

        .digitBubble{
          position:relative;
          height:72px;
          border-radius:50%;
          background:#202b3f;
          border:5px solid #2d3a52;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          color:#f4f7fb;
          box-shadow:0 10px 25px rgba(0,0,0,.18);
        }

        .digitBubble.active{
          border-color:#47c8c5;
        }

        .digitBubble.hot{
          border-color:#ff4d63;
        }

        .digitBubble b{
          font-size:21px;
          line-height:1;
        }

        .digitBubble span{
          margin-top:7px;
          font-size:13px;
          color:#a6b0c1;
        }

        .digitBubble.active span{
          color:#48d7d0;
        }

        .digitBubble.hot span{
          color:#ff4d63;
        }

        .timeScale{
          position:absolute;
          left:112px;
          right:108px;
          bottom:0;
          z-index:6;
          display:flex;
          justify-content:space-between;
          color:#aab4c5;
          font-size:14px;
          pointer-events:none;
        }

        @media(max-width:900px){
          .metaChart{
            min-height:580px;
          }

          .chartHeader{
            left:58px;
            right:80px;
            min-width:0;
          }

          .digitStrip{
            left:64px;
            right:12px;
            grid-template-columns:repeat(5, 1fr);
            bottom:12px;
          }

          .timeScale{
            display:none;
          }

          .rightScale{
            display:none;
          }

          .lineLayer{
            right:18px;
            bottom:180px;
          }
        }
      `}</style>

      <div className="chartGrid" />

      <div className="chartSidebar">
        <div className="sideTool active">1T</div>
        <div className="sideTool">↗</div>
        <div className="sideTool">▥</div>
        <div className="sideTool">◈</div>
        <div className="sideTool">⇩</div>
        <div className="zoomTools">
          <div className="sideTool">+</div>
          <div className="sideTool">⊕</div>
          <div className="sideTool">−</div>
        </div>
      </div>

      <div className="chartHeader">
        <div className="chartHeaderIcon">▥</div>
        <div>
          <h2>{marketName}</h2>
          <p>
            {quote === null ? "..." : quote.toFixed(2)}
            <span>
              {move >= 0 ? "+" : ""}
              {move.toFixed(2)} ({movePercent.toFixed(2)}%)
            </span>
          </p>
        </div>
        <div className="chartStatus">⌄</div>
      </div>

      <div className="percentBadge">100%</div>
      <div className="liveBadge">{status}</div>

      <div className="lineLayer">
        <svg className="lineSvg" viewBox="0 0 900 520" preserveAspectRatio="none">
          {chart.fill && <polygon className="areaFill" points={chart.fill} />}
          {chart.line && <polyline className="priceLine" points={chart.line} />}
          {chart.line && (
            <circle className="priceDot" cx={chart.currentX} cy={chart.currentY} r="6" />
          )}
        </svg>

        {quote !== null && (
          <div
            className="priceTag"
            style={{
              top: `${(chart.currentY / 520) * 100}%`,
            }}
          >
            {quote.toFixed(2)}
            <small>{previousQuote === null ? quote.toFixed(2) : previousQuote.toFixed(2)}</small>
          </div>
        )}
      </div>

      <div className="rightScale">
        {chart.labels.map((label, index) => (
          <span key={index}>{label.toFixed(2)}</span>
        ))}
      </div>

      <div className="digitStrip">
        {digitStats.map((item) => (
          <div
            key={item.digit}
            className={[
              "digitBubble",
              String(item.digit) === lastDigit ? "active" : "",
              item.percent < 8 && ticks.length > 20 ? "hot" : "",
            ].join(" ")}
          >
            <b>{item.digit}</b>
            <span>{item.percent.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="timeScale">
        {newestTicks
          .filter((_, index) => index % 8 === 0)
          .slice(0, 6)
          .map((tick, index) => (
            <span key={`${tick.time}-${index}`}>{tick.time}</span>
          ))}
      </div>
    </section>
  );
}
