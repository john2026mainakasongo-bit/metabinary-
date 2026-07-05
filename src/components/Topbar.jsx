export default function Topbar({
  balance = 0,
  account = "demo",
  setAccount,
  logout,
  openDeposit,
}) {
  return (
    <header className="topbar">
      <div className="brand">MetaBinary</div>

      <nav className="nav">
        <button type="button">Trader&apos;s Hub</button>

        <button type="button" onClick={openDeposit}>
          Deposit
        </button>

        <button type="button" onClick={() => alert("Withdraw coming soon")}>
          Withdraw
        </button>

        <button type="button">History</button>
        <button type="button">Chat</button>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </nav>

      <div className="accountBox">
        <select value={account} onChange={(e) => setAccount(e.target.value)}>
          <option value="demo">Demo</option>
          <option value="real">Real</option>
        </select>

        <div className="balance">${Number(balance).toFixed(2)}</div>

        <button type="button" className="depositBtn" onClick={openDeposit}>
          Deposit
        </button>
      </div>
    </header>
  );
}
