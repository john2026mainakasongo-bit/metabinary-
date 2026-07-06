import { useState } from "react";

export default function TradePanel() {
  const [tradeType, setTradeType] = useState("riseFall");
  const [duration, setDuration] = useState(5);
  const [stake, setStake] = useState(10);
  const [selectedDigit, setSelectedDigit] = useState(8);

  const tradeTypes = [
    { id: "riseFall", name: "Rise/Fall" },
    { id: "evenOdd", name: "Even/Odd" },
    { id: "matchesDiffers", name: "Matches/Differs" },
    { id: "overUnder", name: "Over/Under" },
  ];

  const getButtons = () => {
    if (tradeType === "riseFall") return ["Rise", "Fall"];
    if (tradeType === "evenOdd") return ["Even", "Odd"];
    if (tradeType === "matchesDiffers") return ["Matches", "Differs"];
    if (tradeType === "overUnder") return ["Over", "Under"];
    return ["Rise", "Fall"];
  };

  const buttons = getButtons();

  const placeTrade = (choice) => {
    alert(`Trade placed: ${choice} | Stake: ${stake} USD | Duration: ${duration} ticks`);
  };

  return (
    <div className="tradePanel">
      <div className="learnText">ⓘ Learn about this trade type</div>

      <div className="tradeTypeBox">
        <h2>{tradeTypes.find((t) => t.id === tradeType)?.name}</h2>

        <div className="tradeTypeButtons">
          {tradeTypes.map((type) => (
            <button
              key={type.id}
              className={tradeType === type.id ? "active" : ""}
              onClick={() => setTradeType(type.id)}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {(tradeType === "matchesDiffers" || tradeType === "overUnder") && (
        <div className="digitSelectBox">
          <span>Digit</span>

          <div className="digitSelectGrid">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                className={selectedDigit === digit ? "active" : ""}
                onClick={() => setSelectedDigit(digit)}
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="inputRow">
        <span>Duration</span>
        <div>
          <button onClick={() => setDuration(Math.max(1, duration - 1))}>−</button>
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

      <div className="actionButtons">
        <button className="buyBtn green" onClick={() => placeTrade(buttons[0])}>
          <span>{buttons[0]}</span>
          <small>
            Payout <b>{(stake * 2.22).toFixed(2)} USD</b>
          </small>
        </button>

        <button className="buyBtn red" onClick={() => placeTrade(buttons[1])}>
          <span>{buttons[1]}</span>
          <small>
            Payout <b>{(stake * 1.82).toFixed(2)} USD</b>
          </small>
        </button>
      </div>
    </div>
  );
}
