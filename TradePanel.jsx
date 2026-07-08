export default function TradePanel() {
  return (
    <div className="tradePanel">
      <p className="learn">ⓘ Learn about this trade type</p>

      <div className="tradeTitle">
        <span className="backIcon">‹</span>
        <span className="tradeIcon">▦</span>
        <span className="tradeIcon">△</span>
        <b>Even/Odd</b>
      </div>

      <div className="tickBox">
        <div className="tickTop">Ticks</div>

        <div className="tickDots">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => (
            <span key={x}></span>
          ))}
        </div>

        <h3>1 Tick</h3>
      </div>

      <div className="stakeBox">
        <div className="stakeTabs">
          <button className="active">Stake</button>
          <button>Payout</button>
        </div>

        <div className="amountRow">
          <button>-</button>
          <input value="10" readOnly />
          <button>+</button>
          <select defaultValue="USD">
            <option>USD</option>
            <option>AUD</option>
            <option>KES</option>
          </select>
        </div>
      </div>

      <button className="tradeBuy evenBuy">
        <span>▦ Even</span>
        <b>82.00%</b>
      </button>

      <button className="tradeBuy oddBuy">
        <span>△ Odd</span>
        <b>82.00%</b>
      </button>
    </div>
  );
}
