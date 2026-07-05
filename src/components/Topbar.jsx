export default function Topbar({
  balance = 0,
  account = "demo",
  setAccount,
  logout,
  openDeposit,
}) {
  return (
    <header className="topbar">

      <div className="brand">
        MetaBinary
      </div>

      <nav className="nav">

        <button>Trader's Hub</button>

        <button onClick={openDeposit}>
          Deposit
        </button>

        <button onClick={() => alert("Withdraw coming soon")}>
          Withdraw
        </button>

        <button>
          History
        </button>

        <button>
          Chat
        </button>

        <button onClick={logout}>
          Logout
        </button>

      </nav>

      <div className="accountBox">

        <select
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        >
          <option value="demo">
            Demo
          </option>

          <option value="real">
            Real
          </option>

        </select>

        <div className="balance">

          ${Number(balance).toFixed(2)}

        </div>

        <button
          className="depositBtn"
          onClick={openDeposit}
        >
          Deposit
        </button>

      </div>

    </header>
  );
}
