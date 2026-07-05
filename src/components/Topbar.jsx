export default function Topbar({ balance, account, setAccount, logout }) {
  return (
    <div className="topbar">
      <div className="brand">MetaBinary</div>

      <div className="topActions">
        <select value={account} onChange={(e) => setAccount(e.target.value)}>
          <option value="demo">Demo</option>
          <option value="real">Real</option>
        </select>

        <div className="balance">${balance.toFixed(2)}</div>

        <button className="depositBtn">Deposit</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
