import { useState } from "react";

export default function TradePanel() {
  const [tradeType, setTradeType] = useState("Rise/Fall");
  const [duration, setDuration] = useState(5);
  const [stake, setStake] = useState(10);
  const [selectedDigit, setSelectedDigit] = useState(5);
  const [message, setMessage] = useState("");

  const tradeTypes = ["Rise/Fall", "Even/Odd", "Matches/Differs", "Over/Under"];

  const getButtons = () => {
    if (tradeType === "Rise/Fall") return ["Rise", "Fall"];
    if (tradeType === "Even/Odd") return ["Even", "Odd"];
    if (tradeType === "Matches/Differs") return ["Matches", "Differs"];
    if (tradeType === "Over/Under") return ["Over", "Under"];
    return ["Rise", "Fall"];
  };

  const buttons = getButtons();

  const placeTrade = (choice) => {
    setMessage(
      `Trade placed: ${choice} | ${tradeType} | Stake ${stake} USD | Duration ${duration} ticks`
    );
  };

  return (
    <aside className="tradePanel">
      <div className="learn">ⓘ Learn about this trade type</div>

      <div className="tradeBox">
        <h2>{tradeType}</h2>

        <div className="tradeSelector">
          {tradeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTradeType(type)}
              className={tradeType === type ? "active" : ""}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {(tradeType === "Matches/Differs" || tradeType === "Over/Under") && (
        <div className="tradeBox">
          <h3>Select digit</h3>

          <div className="selectDigits">
            {[0,1,2,3,4,5,6,7,8,9].map((digit) => (
              <button
                key={digit}
                onClick={() => setSelectedDigit(digit)}
                className={selectedDigit === digit ? "active" : ""}
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="tradeRowNew">
        <span>Duration</span>

        <div className="stepper">
          <button onClick={() => setDuration(Math.max(1, duration - 1))}>−</button>
          <b>{duration} ticks</b>
          <button onClick={() => setDuration(duration + 1)}>+</button>
        </div>
      </div>

      <div className="tradeRowNew">
        <span>Stake</span>

        <div className="stepper">
          <button onClick={() => setStake(Math.max(1, stake - 1))}>−</button>
          <b>{stake} USD</b>
          <button onClick={() => setStake(stake + 1)}>+</button>
        </div>
      </div>

      <div className="tradeActions">
        <button className="riseAction" onClick={() => placeTrade(buttons[0])}>
          <strong>{buttons[0]}</strong>
          <small>Payout <b>{(stake * 2.22).toFixed(2)} USD</b></small>
        </button>

        <button className="fallAction" onClick={() => placeTrade(buttons[1])}>
          <strong>{buttons[1]}</strong>
          <small>Payout <b>{(stake * 1.82).toFixed(2)} USD</b></small>
        </button>
      </div>

      {message && <div className="tradeMessage">{message}</div>}
    </aside>
  );
}
