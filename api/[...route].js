import crypto from "crypto";
import { MongoClient } from "mongodb";

let clientPromise;

const iterations = 120000;
const keyLength = 32;
const digest = "sha256";

export default async function handler(req, res) {
  try {
    const route = getRoute(req);

    if (req.method === "POST" && route === "register") return register(req, res);
    if (req.method === "POST" && route === "login") return login(req, res);
    if (req.method === "POST" && route === "reset-password") return resetPassword(req, res);

    if (req.method === "GET" && route.startsWith("user/")) return getUser(req, res, part(route, 1));
    if (req.method === "PUT" && route.startsWith("settings/")) return saveSettings(req, res, part(route, 1));
    if (req.method === "GET" && route.startsWith("transactions/")) return getTransactions(req, res, part(route, 1));

    if (req.method === "POST" && route === "withdraw") return withdraw(req, res);
    if (req.method === "POST" && route === "record-trade") return recordTrade(req, res);

    if (req.method === "POST" && route === "partner/apply") return partnerApply(req, res);
    if (req.method === "GET" && route.startsWith("partner/")) return getPartner(req, res, part(route, 1));

    if (req.method === "POST" && route === "create-intasend-stk-push") return createStkPush(req, res);
    if (req.method === "GET" && route === "deposit-status") return depositStatus(req, res);
    if (req.method === "POST" && route === "claim-deposit") return claimDeposit(req, res);
    if (req.method === "POST" && route === "intasend-webhook") return intasendWebhook(req, res);

    return res.status(404).json({ error: "Route not found." });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error." });
  }
}

function getRoute(req) {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url, `https://${host}`);
  return decodeURIComponent(url.pathname.replace(/^\/api\/?/, "").replace(/\/$/, ""));
}

function part(route, i) {
  return decodeURIComponent(route.split("/")[i] || "");
}

async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB is not configured yet.");
  }
  if (!clientPromise) clientPromise = new MongoClient(process.env.MONGODB_URI).connect();
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "metabinary");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function normalizeKenyanPhone(phone) {
  const digits = String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  return digits;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(String(password), salt, iterations, keyLength, digest).toString("hex");
  return `${iterations}:${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [savedIterations, salt, savedHash] = String(stored || "").split(":");
  if (!savedIterations || !salt || !savedHash) return false;
  const hash = crypto.pbkdf2Sync(String(password), salt, Number(savedIterations), keyLength, digest).toString("hex");
  if (hash.length !== savedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(savedHash, "hex"));
}

function makeAccountId() {
  return `MB${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
}

function makeRef(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function defaultSettings(user = {}) {
  return {
    profileName: user.fullName || "",
    phone: user.phone || "",
    depositPhone: user.phone || "",
    withdrawalPhone: user.phone || "",
    theme: "dark",
    chartSpeed: "normal",
    realTradingEnabled: false,
    maximumStakeLimit: 100,
    dailyTradeLimit: 25,
    notifications: true,
    sound: true,
    ...(user.settings || {}),
  };
}

function publicUser(user) {
  return {
    accountId: user.accountId,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    idNumber: user.idNumber,
    country: user.country,
    documentType: user.documentType,
    demoBalance: Number(user.demoBalance ?? 10000),
    realBalance: Number(user.realBalance ?? 0),
    partnerBalance: Number(user.partnerBalance ?? 0),
    referredBy: user.referredBy || "",
    partnerId: user.partnerId || "",
    settings: user.settings || defaultSettings(user),
    createdAt: user.createdAt,
  };
}

async function register(req, res) {
  const body = req.body || {};
  const db = await getDb();

  const user = {
    accountId: makeAccountId(),
    fullName: String(body.fullName || "").trim(),
    email: normalizeEmail(body.email),
    phone: normalizePhone(body.phone),
    idNumber: String(body.idNumber || "").trim(),
    country: String(body.country || "").trim(),
    documentType: String(body.documentType || "").trim(),
    passwordHash: hashPassword(String(body.password || "")),
    referredBy: String(body.ref || "").trim(),
    demoBalance: 10000,
    realBalance: 0,
    partnerBalance: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!user.fullName || !user.email || !user.phone || !user.idNumber || !user.country || !user.documentType || !body.password) {
    return res.status(400).json({ error: "Fill in all registration fields." });
  }

  if (String(body.password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  if (!body.agreed) {
    return res.status(400).json({ error: "You must accept the agreement." });
  }

  await db.collection("users").createIndex({ accountId: 1 }, { unique: true });
  await db.collection("users").createIndex({ idNumber: 1 }, { unique: true });

  const existingId = await db.collection("users").findOne({ idNumber: user.idNumber });
  if (existingId) {
    return res.status(409).json({ error: "This ID number already has an account." });
  }

  user.settings = defaultSettings(user);

  await db.collection("users").insertOne(user);

  return res.status(201).json({
    user: publicUser(user),
    message: `Account ${user.accountId} created successfully.`,
  });
}

async function login(req, res) {
  const db = await getDb();
  const identifier = String(req.body?.identifier || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!identifier || !password) {
    return res.status(400).json({ error: "Enter Email/Account ID and password." });
  }

  const users = await db.collection("users").find({
    $or: [
      { email: normalizeEmail(identifier) },
      { accountId: identifier.toUpperCase() },
      { accountId: identifier },
    ],
  }).sort({ createdAt: -1 }).toArray();

  const user = users.find((u) => verifyPassword(password, u.passwordHash));

  if (!user) {
    return res.status(401).json({ error: "Email/Account ID or password is incorrect." });
  }

  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { lastLoginAt: new Date().toISOString() } }
  );

  return res.status(200).json({
    user: publicUser(user),
    message: `Logged in as ${user.accountId}.`,
  });
}

async function resetPassword(req, res) {
  return res.status(200).json({
    message: "Password reset can be connected to email delivery next.",
  });
}

async function getUser(req, res, emailParam) {
  const db = await getDb();
  const user = await db.collection("users").findOne({ email: normalizeEmail(emailParam) });
  if (!user) return res.status(404).json({ error: "Account not found." });
  return res.status(200).json({ user: publicUser(user) });
}

async function saveSettings(req, res, emailParam) {
  const db = await getDb();
  const email = normalizeEmail(emailParam);
  const current = await db.collection("users").findOne({ email });
  if (!current) return res.status(404).json({ error: "Account not found." });

  const incoming = req.body?.settings || {};
  const settings = {
    ...defaultSettings(current),
    profileName: String(incoming.profileName || current.fullName || "").trim(),
    phone: String(incoming.phone || current.phone || "").trim(),
    depositPhone: String(incoming.depositPhone || "").trim(),
    withdrawalPhone: String(incoming.withdrawalPhone || "").trim(),
    theme: incoming.theme === "light" ? "light" : "dark",
    chartSpeed: ["slow", "normal", "fast"].includes(incoming.chartSpeed) ? incoming.chartSpeed : "normal",
    realTradingEnabled: Boolean(incoming.realTradingEnabled),
    maximumStakeLimit: Math.max(0.3, Number(incoming.maximumStakeLimit) || 100),
    dailyTradeLimit: Math.max(1, Number(incoming.dailyTradeLimit) || 25),
    notifications: incoming.notifications !== false,
    sound: incoming.sound !== false,
  };

  const update = {
    fullName: settings.profileName,
    phone: settings.phone,
    settings,
    updatedAt: new Date().toISOString(),
  };

  if (req.body?.newPassword) {
    update.passwordHash = hashPassword(String(req.body.newPassword));
  }

  await db.collection("users").updateOne({ email }, { $set: update });
  const updated = await db.collection("users").findOne({ email });

  return res.status(200).json({
    user: publicUser(updated),
    message: "Settings saved.",
  });
}

async function getTransactions(req, res, emailParam) {
  const db = await getDb();
  const transactions = await db.collection("transactions")
    .find({ email: normalizeEmail(emailParam) })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return res.status(200).json({ transactions });
}

async function withdraw(req, res) {
  const db = await getDb();

  const email = normalizeEmail(req.body?.email);
  const amount = Number(req.body?.amount);
  const phone = normalizePhone(req.body?.phone);

  if (!email || !phone || !Number.isFinite(amount)) {
    return res.status(400).json({ error: "Withdrawal email, phone, and amount are required." });
  }
  if (amount < 5) return res.status(400).json({ error: "Minimum withdrawal is 5 USD." });
  if (amount > 150000) return res.status(400).json({ error: "Maximum withdrawal is 150000 USD." });

  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found." });
  if (Number(user.realBalance || 0) < amount) {
    return res.status(400).json({ error: "Real balance is not enough." });
  }

  const balanceAfter = Number((Number(user.realBalance) - amount).toFixed(2));

  await db.collection("users").updateOne(
    { email },
    { $inc: { realBalance: -amount }, $set: { updatedAt: new Date().toISOString() } }
  );

  const transaction = {
    email,
    type: "withdrawal",
    amount,
    phone,
    status: "pending",
    accountType: "Real",
    balanceAfter,
    reference: makeRef("wd"),
    createdAt: new Date().toISOString(),
  };

  await db.collection("transactions").insertOne(transaction);
  const updated = await db.collection("users").findOne({ email });

  return res.status(200).json({
    user: publicUser(updated),
    transaction,
    message: "Withdrawal request created. Real balance updated immediately.",
  });
}

async function recordTrade(req, res) {
  const db = await getDb();

  const email = normalizeEmail(req.body?.email);
  const stake = Number(req.body?.stake || 0);
  const profit = Number(req.body?.profit || 0);
  const balanceAfter = Number(req.body?.balanceAfter || 0);
  const accountType = req.body?.accountType === "Real" ? "Real" : "Demo";

  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found." });

  const txn = {
    email,
    type: "trade",
    tradeType: String(req.body?.tradeType || ""),
    amount: stake,
    profit,
    status: profit >= 0 ? "win" : "loss",
    accountType,
    balanceAfter,
    reference: makeRef("trade"),
    createdAt: new Date().toISOString(),
  };

  await db.collection("transactions").insertOne(txn);

  await db.collection("users").updateOne(
    { email },
    {
      $set: {
        [accountType === "Real" ? "realBalance" : "demoBalance"]: balanceAfter,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  if (accountType === "Real" && user.referredBy && profit < 0) {
    const commission = Number((Math.abs(profit) * 0.05).toFixed(2));
    await db.collection("commissions").insertOne({
      partnerId: user.referredBy,
      referralEmail: email,
      amount: commission,
      status: "pending",
      source: "real-trade",
      createdAt: new Date().toISOString(),
    });
  }

  return res.status(200).json({ transaction: txn });
}

async function partnerApply(req, res) {
  const db = await getDb();
  const email = normalizeEmail(req.body?.email);
  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found." });

  const partnerId = user.partnerId || makeRef("partner").replace(/-/g, "").toUpperCase();
  const origin = req.headers.origin || `https://${req.headers.host || "metabinary-cewf.vercel.app"}`;
  const partner = {
    partnerId,
    email,
    referralLink: `${origin}/register?ref=${partnerId}`,
    createdAt: user.partnerCreatedAt || new Date().toISOString(),
  };

  await db.collection("users").updateOne(
    { email },
    { $set: { partnerId, partnerCreatedAt: partner.createdAt, updatedAt: new Date().toISOString() } }
  );

  await db.collection("partners").updateOne(
    { partnerId },
    { $set: partner },
    { upsert: true }
  );

  return res.status(200).json({
    partner,
    message: "Partner account opened successfully.",
  });
}

async function getPartner(req, res, emailParam) {
  const db = await getDb();
  const email = normalizeEmail(emailParam);
  const user = await db.collection("users").findOne({ email });
  if (!user?.partnerId) return res.status(404).json({ error: "Partner account not found." });

  const partner = await db.collection("partners").findOne({ partnerId: user.partnerId });
  const referrals = await db.collection("users").find({ referredBy: user.partnerId }).toArray();
  const referralEmails = referrals.map((u) => u.email);

  const transactions = await db.collection("transactions")
    .find({ email: { $in: referralEmails } })
    .toArray();

  const commissions = await db.collection("commissions")
    .find({ partnerId: user.partnerId })
    .toArray();

  return res.status(200).json({
    partner,
    stats: {
      totalReferredUsers: referrals.length,
      activeRealTraders: new Set(transactions.filter((t) => t.accountType === "Real").map((t) => t.email)).size,
      totalRealDeposits: sum(transactions.filter((t) => t.type === "deposit").map((t) => t.amount)),
      totalRealTradeVolume: sum(transactions.filter((t) => t.type === "trade").map((t) => t.amount)),
      totalCommissionEarned: sum(commissions.map((c) => c.amount)),
      pendingCommission: sum(commissions.filter((c) => c.status === "pending").map((c) => c.amount)),
      paidCommission: sum(commissions.filter((c) => c.status === "paid").map((c) => c.amount)),
    },
  });
}

async function createStkPush(req, res) {
  const secretKey = process.env.INTASEND_SECRET_KEY || process.env.INTASEND_PRIVATE_KEY || process.env.INTASEND_TOKEN;
  const publicKey = process.env.INTASEND_PUBLISHABLE_KEY || process.env.INTASEND_PUBLIC_KEY;

  if (!secretKey || !publicKey) {
    return res.status(500).json({ error: "IntaSend keys are missing." });
  }

  const body = req.body || {};
  const amount = Number(body.amount || 0);
  const usdAmount = Number(body.usd_amount || 0);
  const accountId = String(body.account_id || "").trim();
  const email = normalizeEmail(body.email);
  const phone_number = normalizeKenyanPhone(body.phone_number);

  if (amount < 10 || usdAmount <= 0) {
    return res.status(400).json({ error: "Invalid deposit amount." });
  }

  const apiRef = `stk-${Date.now()}`;
  const origin = req.headers.origin || `https://${req.headers.host}`;
  const webhook = process.env.INTASEND_WEBHOOK_URL || `${origin}/api/intasend-webhook`;

  const payload = {
    public_key: publicKey,
    amount,
    currency: "KES",
    phone_number,
    email,
    api_ref: apiRef,
    comment: "MetaBinary deposit",
    callback_url: webhook,
    webhook_url: webhook,
    first_name: "Meta",
    last_name: "Binary",
    host: req.headers.host,
  };

  const response = await fetch("https://payment.intasend.com/api/v1/payment/mpesa-stk-push/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return res.status(response.status).json({
      error: data.detail || data.error || data.message || "Failed to start STK push.",
    });
  }

  const db = await getDb();
  await db.collection("deposits").insertOne({
    apiRef,
    accountId,
    email,
    phone_number,
    kesAmount: amount,
    usdAmount,
    status: "pending",
    credited: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return res.status(200).json({
    api_ref: apiRef,
    usd_amount: usdAmount,
    kes_amount: amount,
    message: "STK push sent. Balance will update after payment confirmation.",
  });
}

async function depositStatus(req, res) {
  const apiRef = String(req.query?.api_ref || "").trim();
  const db = await getDb();
  const deposit = await db.collection("deposits").findOne({ apiRef });
  if (!deposit) return res.status(404).json({ error: "Deposit not found." });

  return res.status(200).json({
    api_ref: deposit.apiRef,
    confirmed: deposit.status === "completed",
    credited: Boolean(deposit.credited),
    status: deposit.status,
    usd_amount: deposit.usdAmount,
    kes_amount: deposit.kesAmount,
  });
}

async function claimDeposit(req, res) {
  const db = await getDb();
  const apiRef = String(req.body?.api_ref || "").trim();
  const accountId = String(req.body?.account_id || "").trim();

  const deposit = await db.collection("deposits").findOne({
    apiRef,
    accountId,
    status: "completed",
  });

  if (!deposit) {
    return res.status(409).json({ error: "Deposit is not confirmed yet." });
  }

  if (deposit.credited) {
    const user = await db.collection("users").findOne({ accountId });
    return res.status(200).json({
      api_ref: apiRef,
      credited: true,
      usd_amount: deposit.usdAmount,
      user: publicUser(user),
      message: "Deposit already credited.",
    });
  }

  const user = await db.collection("users").findOne({ accountId });
  if (!user) return res.status(404).json({ error: "Account not found." });

  const newBalance = Number((Number(user.realBalance || 0) + Number(deposit.usdAmount || 0)).toFixed(2));

  await db.collection("users").updateOne(
    { accountId },
    { $set: { realBalance: newBalance, updatedAt: new Date().toISOString() } }
  );

  await db.collection("deposits").updateOne(
    { apiRef },
    { $set: { credited: true, creditedAt: new Date(), updatedAt: new Date() } }
  );

  await db.collection("transactions").insertOne({
    email: user.email,
    type: "deposit",
    amount: Number(deposit.usdAmount || 0),
    status: "completed",
    accountType: "Real",
    balanceAfter: newBalance,
    reference: apiRef,
    createdAt: new Date().toISOString(),
  });

  const updated = await db.collection("users").findOne({ accountId });

  return res.status(200).json({
    api_ref: apiRef,
    credited: true,
    usd_amount: deposit.usdAmount,
    user: publicUser(updated),
    message: "Deposit credited successfully.",
  });
}

async function intasendWebhook(req, res) {
  const db = await getDb();
  const payload = req.body || {};
  const apiRef =
    payload?.api_ref ||
    payload?.apiRef ||
    payload?.invoice?.api_ref ||
    payload?.data?.api_ref ||
    "";

  const status =
    payload?.state ||
    payload?.status ||
    payload?.invoice?.state ||
    payload?.invoice?.status ||
    payload?.data?.status ||
    "";

  if (!apiRef) return res.status(400).json({ error: "Missing api_ref." });

  await db.collection("deposits").updateOne(
    { apiRef },
    {
      $set: {
        status: isPaid(status) ? "completed" : String(status || "pending"),
        webhookPayload: payload,
        updatedAt: new Date(),
      },
    }
  );

  return res.status(200).json({ received: true, api_ref: apiRef, status });
}

function isPaid(status) {
  const s = String(status || "").toLowerCase();
  return ["completed", "complete", "success", "successful", "confirmed", "paid"].some((x) => s.includes(x));
}

function sum(arr) {
  return Number(arr.reduce((a, b) => a + Number(b || 0), 0).toFixed(2));
}
