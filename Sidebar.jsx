export default function Sidebar({
  openTrades = [],
  closedTrades = [],
}) {
  return (
    <aside className="leftPanel">
      <div className="tabs">
        <span className="active">Open ({openTrades.length})</span>
        <span>Closed ({closedTrades.length})</span>
      </div>

      <div className="positions">
        {openTrades.length === 0 ? (
          <>
            <div className="avatar">MB</div>
            <h2>No open positions</h2>
            <p>Your MetaBinary trades will appear here</p>
          </>
        ) : (
          openTrades.map((trade) => (
            <div className="tradeCard" key={trade.id}>
              <b>{trade.contractType || "Even/Odd"}</b>
              <span>
                {trade.choice || "Even"} • {trade.mode || "Demo"} • $
                {trade.stake || 0}
              </span>
              <small>Target digit {trade.target ?? "-"}</small>
            </div>
          ))
        )}

        {closedTrades.slice(0, 5).map((trade) => (
          <div
            className={`tradeCard ${trade.win ? "win" : "loss"}`}
            key={`closed-${trade.id}`}
          >
            <b>
              {trade.win ? "WIN" : "LOSS"} • {trade.choice}
            </b>

            <span>Result digit: {trade.result}</span>
            <small>Payout ${Number(trade.payout || 0).toFixed(2)}</small>
          </div>
        ))}
      </div>
    </aside>
  );
}
