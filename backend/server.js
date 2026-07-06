import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const users = {};

function safeUser(user) {
  return {
    name: user.name,
    email: user.email,
    demoBalance: user.demoBalance,
    realBalance: user.realBalance,
  };
}

function ensureUser(email) {
  if (!users[email]) {
    users[email] = {
      name: "MetaBinary User",
      email,
      password: "123456",
      demoBalance: 10000,
      realBalance: 0,
    };
  }

  return users[email];
}

app.get("/", (req, res) => {
  res.send("MetaBinary Backend Running");
});

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password required",
    });
  }

  if (users[email]) {
    return res.json({
      success: false,
      message: "Account already exists",
    });
  }

  users[email] = {
    name: name || "",
    email,
    password,
    demoBalance: 10000,
    realBalance: 0,
  };

  res.json({
    success: true,
    token: "token-" + Date.now(),
    user: safeUser(users[email]),
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users[email];

  if (!user) {
    return res.json({
      success: false,
      message: "Account not found",
    });
  }

  if (user.password !== password) {
    return res.json({
      success: false,
      message: "Wrong password",
    });
  }

  res.json({
    success: true,
    token: "token-" + Date.now(),
    user: safeUser(user),
  });
});

app.get("/api/user/:email", (req, res) => {
  const user = ensureUser(req.params.email);

  res.json({
    success: true,
    user: safeUser(user),
  });
});

app.post("/api/deposit", (req, res) => {
  const { email, amount, phone } = req.body;

  if (!email || !amount) {
    return res.json({
      success: false,
      message: "Email and amount required",
    });
  }

  const user = ensureUser(email);
  const depositAmount = Number(amount);

  if (!depositAmount || depositAmount <= 0) {
    return res.json({
      success: false,
      message: "Invalid amount",
    });
  }

  user.realBalance += depositAmount;

  res.json({
    success: true,
    message: phone
      ? `Deposit request received for ${phone}. Balance updated.`
      : "Deposit added. Balance updated.",
    user: safeUser(user),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MetaBinary backend running on port ${PORT}`);
});
