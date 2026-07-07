            gap:16px;
            padding:18px;
          }

          .methodIcon{
            width:58px;
            height:58px;
            font-size:28px;
          }

          .methodText strong{
            font-size:21px;
          }

          .methodText span{
            font-size:17px;
          }
        }
      `}</style>

      {menuOpen && (
        <>
          <div className="drawerOverlay" onClick={() => setMenuOpen(false)} />
          <div className="drawer">
            <h2>MetaBinary</h2>
            <button onClick={() => { setPage("trade"); setMenuOpen(false); }}>Trade</button>
            <button onClick={() => { openDepositModal(); setMenuOpen(false); }}>Deposit</button>
            <button onClick={() => { alert("Withdraw coming soon"); setMenuOpen(false); }}>Withdraw</button>
            <button onClick={() => { alert("Transactions coming soon"); setMenuOpen(false); }}>Transactions</button>
          </div>
        </>
      )}

      {depositOpen && (
        <div className="depositOverlay">
          <div className="depositModal">
            <div className="depositHeader">
              <div>
                <h2>Deposit Funds</h2>
                <p>Choose payment method</p>
              </div>
              <button className="closeDeposit" onClick={closeDepositModal}>x</button>
            </div>

            {depositStep === "methods" ? (
              <div className="depositBody">
                <button className="paymentMethod" onClick={() => setDepositStep("mpesa")}>
                  <div className="methodIcon mpesaIcon">M</div>
                  <div className="methodText">
                    <strong>M-Pesa</strong>
                    <span>Instant mobile money</span>
                  </div>
                  <div className="methodArrow">›</div>
                </button>

                <button className="paymentMethod" onClick={() => alert("Card deposits coming soon")}>
                  <div className="methodIcon cardIcon">▭</div>
                  <div className="methodText">
                    <strong>Credit/Debit Card</strong>
                    <span>Visa, Mastercard</span>
                  </div>
                  <div className="methodArrow">›</div>
                </button>

                <button className="paymentMethod" onClick={() => alert("USDT deposits coming soon")}>
                  <div className="methodIcon usdtIcon">B</div>
                  <div className="methodText">
                    <strong>USDT (TRC20)</strong>
                    <span>Cryptocurrency</span>
                  </div>
                  <div className="methodArrow">›</div>
                </button>
              </div>
            ) : (
              <div className="depositBody">
                <button className="backLine" onClick={() => setDepositStep("methods")}>‹ Back</button>

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
        <button className="menuBtn" onClick={() => setMenuOpen(true)}>☰</button>
        <button className={page === "trade" ? "active" : ""} onClick={() => setPage("trade")}>Trade</button>
        <button>Charts</button>
        <button>Free Bot</button>
        <button>Copy Trading</button>
      </div>

      <div className="market">
        <div>
          <h1>Volatility 100 (1s) Index</h1>
          <p>819.75 - 0.02 (0.00%)</p>
        </div>
        <div className="last">7</div>
      </div>

      <div className="tradeBtns">
        <button className="rise">Rise</button>
        <button className="fall">Fall</button>
      </div>
    </div>
  );
}
