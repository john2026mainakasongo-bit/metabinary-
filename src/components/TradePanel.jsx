import { useState } from "react";

export default function TradePanel() {
  const [tradeType, setTradeType] = useState("riseFall");
  const [duration, setDuration] = useState(5);
  const [stake, setStake] = useState(10);
  const [message, setMessage] = useState("");

  const tradeTypes = [
    "Rise/Fall",
    "Even/Odd",
    "Matches/Differs",
    "Over/Under",
  ];

  const buyTrade = (choice) => {
    setMessage(
      `Trade placed: ${choice} | Stake ${stake} USD | Duration ${duration} ticks`
    );

    alert(`Trade placed: ${choice}`);
  };

  const getButtons = () => {
    if (tradeType === "Rise/Fall") return ["Rise", "Fall"];
    if (tradeType === "Even/Odd") return ["Even", "Odd"];
    if (tradeType === "Matches/Differs") return ["Matches", "Differs"];
    if (tradeType === "Over/Under") return ["Over", "Under"];
    return ["Rise", "Fall"];
  };

  const buttons = getButtons();

  return (
    <aside className="tradePanel">
      <div className="learn">ⓘ Learn about this trade type</div>

      <div className="tradeTypeBox">
        <h2>{tradeType}</h2>

        <div className="tradeTypeButtons">
          {tradeTypes.map((type) => (
            <button
              key={type}
              className={tradeType === type ? "active" : ""}
              onClick={() => setTradeType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="inputRow">
        <span>Duration</span>

        <div>
          <button onClick={() => setDuration(Math.max(1, duration - 1))}>
            −
          </button>

          <strong>{duration} ticks</strong>

          <button onClick={() => setDuration(duration + 1)}>+</button>
        </div>
      </div>

      <div className="inputRow">
        <span>Stake</span>

        <div>
          <button onClick={() => setStake(Math.max(1, stake - 1))}>−</button>

          <strong>{stake} USD</strong>

          <button onClick={() => setStake(stake + 1)}>+</button>
        </div>
      </div>

      <div className="choice">
        <button className="green" onClick={() => buyTrade(buttons[0])}>
          {buttons[0]}
          <small>Payout</small>
          <strong>{(stake * 2.22).toFixed(2)} USD</strong>
        </button>

        <button className="white" onClick={() => buyTrade(buttons[1])}>
          {buttons[1]}
          <small>Payout</small>
          <strong>{(stake * 1.82).toFixed(2)} USD</strong>
        </button>
      </div>

      {message && <div className="tradeMessage">{message}</div>}
    </aside>
  );
}
