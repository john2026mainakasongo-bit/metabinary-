export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Positions</h3>

      <div className="positionCard">
        <span>Open Positions</span>
        <strong>0</strong>
      </div>

      <div className="positionCard">
        <span>Closed Positions</span>
        <strong>0</strong>
      </div>

      <h3>Markets</h3>
      <button>Volatility 10</button>
      <button>Volatility 25</button>
      <button>Volatility 75</button>
      <button>Step Index</button>
    </aside>
  );
}
