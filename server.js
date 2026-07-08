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

app.get("/", (req, res) => {
  res.send("MetaBinary Backend Running");
});

function registerHandler(req, res) {
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
      message: "Account already exists. Login instead.",
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
}

function loginHandler(req, res) {
  const { email, password } = req.body;
  const user = users[email];

  if (!user) {
    return res.json({
      success: false,
      message: "Account not found. Register first.",
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
}

app.post("/api/register", registerHandler);
app.post("/api/login", loginHandler);
app.post("/api/auth/register", registerHandler);
app.post("/api/auth/login", loginHandler);

app.get("/api/user/:email", (req, res) => {
  const user = users[req.params.email];

  if (!user) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    user: safeUser(user),
  });
});

app.post("/api/deposit", (req, res) => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    return res.json({
      success: false,
      message: "Email and amount required",
    });
  }

  if (!users[email]) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  users[email].realBalance += Number(amount);

  res.json({
    success: true,
    message: "Deposit added",
    user: safeUser(users[email]),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MetaBinary backend running on port ${PORT}`);
});
