                <button className="paymentMethod" onClick={() => alert("USDT deposits coming soon")}>
                  <div className="methodIcon usdtIcon">B</div>
                  <div className="methodText">
                    <strong>USDT (TRC20)</strong>
                    <span>Cryptocurrency</span>
                  </div>
                  <div className="methodArrow">&gt;</div>
                </button>
              </div>
            ) : (
              <div className="depositBody">
                <button className="backLine" onClick={() => setDepositStep("methods")}>{"< Back"}</button>

                <label className="modalLabel">Amount (USD)</label>
                <div className="amountInputWrap">
                  <span>$</span>
                  <input
                    type="number"
                    min="1"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>

                <div className="quickAmounts">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      className={Number(depositAmount) === amount ? "active" : ""}
                      onClick={() => setDepositAmount(amount)}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <label className="modalLabel">M-Pesa number</label>
                <input
                  className="phoneInput"
                  value={depositPhone}
                  onChange={(e) => setDepositPhone(e.target.value)}
                />
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
        <button className="menuBtn" onClick={() => setMenuOpen(true)}>Menu</button>
        <button className="active">Trade</button>
        <button>Charts</button>
        <button>Free Bot</button>
        <button>Copy Trading</button>
      </div>

      <main className="layout">
        <section className="chartArea">
          <div className="marketCard">
            <div>
              <h1>Volatility 100 (1s) Index</h1>
              <p>Live Deriv synthetic market</p>
              <div className="livePill">
                <span className="liveDot" />
                {marketStatus}
              </div>
            </div>

            <div className="quoteBox">
              <strong>{quote === null ? "..." : quote.toFixed(2)}</strong>
              <span className={marketMove < 0 ? "down" : ""}>
                {marketMove >= 0 ? "+" : ""}
                {marketMove.toFixed(2)}
              </span>
              <div className="lastDigit">{lastDigit}</div>
            </div>
          </div>

          <div className="chartBox">
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
            <button className="primaryTrade" onClick={() => placeTrade(tradeButtons[0])}>
              {tradeButtons[0]}
            </button>
            <button className="secondaryTrade" onClick={() => placeTrade(tradeButtons[1])}>
              {tradeButtons[1]}
            </button>
          </div>

          {tradeMessage && <div className="tradeMessage">{tradeMessage}</div>}
        </aside>
      </main>
    </div>
  );
}
