export default function Register({ goLogin, onRegister }) {
  function register() {
    localStorage.setItem("token", "demo-token");
    onRegister();
  }

  return (
    <div className="authPage">
      <div className="authBox">
        <h1>MetaBinary</h1>
        <h2>Create Account</h2>
        <input placeholder="Full name" />
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <button onClick={register}>Register</button>
        <p onClick={goLogin}>Already have an account?</p>
      </div>
    </div>
  );
}
