export default function Login({ goRegister, onLogin }) {
  function login() {
    localStorage.setItem("token", "demo-token");
    onLogin();
  }

  return (
    <div className="authPage">
      <div className="authBox">
        <h1>MetaBinary</h1>
        <h2>Login</h2>
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <button onClick={login}>Login</button>
        <p onClick={goRegister}>Create account</p>
      </div>
    </div>
  );
}
