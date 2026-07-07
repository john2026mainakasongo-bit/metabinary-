import { useEffect, useMemo, useRef, useState } from "react";
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
          {account === "Real" && <span>US</span>}
          <select value={account} onChange={(e) => setAccount(e.target.value)}>
            <option>Real</option>
            <option>Demo</option>
          </select>
        </div>
        <div className="wallet" onClick={openDepositModal}>${balance.toFixed(2)}</div>
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
                  <button className="marketSwitch" onClick={() => setMarketMenuOpen(!marketMenuOpen)}>
                    Change synthetic market
                  </button>
                </div>
              </div>
              <div className="livePill"><span className="liveDot" />{marketStatus}</div>
            </div>

            {marketMenuOpen && (
              <div className="marketMenu">
                {MARKETS.map((item) => (
                  <button
                    key={item.symbol}
                    className={item.symbol === market.symbol ? "active" : ""}
                    onClick={() => {
                      setMarket(item);
                      setMarketMenuOpen(false);
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
              <span className={marketMove < 0 ? "down" : ""}>
                {marketMove >= 0 ? "+" : ""}{marketMove.toFixed(2)}
              </span>
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
              <div className="tick" key={`${tick.time}-${index}`}>
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
              <button
                key={type}
                className={tradeType === type ? "active" : ""}
                onClick={() => {
                  setTradeType(type);
                  setTradeMessage("");
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {(tradeType === "Matches/Differs" || tradeType === "Over/Under") && (
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
            <button className="primaryTrade" onClick={() => placeTrade(tradeButtons[0])}>{tradeButtons[0]}</button>
            <button className="secondaryTrade" onClick={() => placeTrade(tradeButtons[1])}>{tradeButtons[1]}</button>
          </div>

          {tradeMessage && <div className="tradeMessage">{tradeMessage}</div>}
        </aside>
      </main>
    </div>
  );
}
