import crypto from "crypto";
import { MongoClient } from "mongodb";

let clientPromise;

const iterations = 120000;
const keyLength = 32;
const digest = "sha256";

export default async function handler(request, response) {
  try {
    const route = getRoute(request);

    if (request.method === "POST" && route === "register") return register(request, response);
    if (request.method === "POST" && route === "login") return login(request, response);
    if (request.method === "POST" && route === "reset-password") return resetPassword(request, response);
    if (request.method === "POST" && route === "verify-email") return verifyEmail(request, response);

    if (request.method === "GET" && route.startsWith("user/")) return getUser(request, response, routePart(route, 1));
    if (request.method === "PUT" && route.startsWith("settings/")) return saveSettings(request, response, routePart(route, 1));
    if (request.method === "GET" && route.startsWith("transactions/")) return getTransactions(request, response, routePart(route, 1));

    if (request.method === "POST" && route === "withdraw") return withdraw(request, response);
    if (request.method === "POST" && route === "record-trade") return recordTrade(request, response);

    if (request.method === "POST" && route === "partner/apply") return partnerApply(request, response);
    if (request.method === "POST" && route === "partner/withdraw") return partnerWithdraw(request, response);
    if (request.method === "GET" && route.startsWith("partner/referrals/")) return partnerReferrals(request, response, routePart(route, 2));
    if (request.method === "GET" && route.startsWith("partner/commissions/")) return partnerCommissions(request, response, routePart(route, 2));
    if (request.method === "GET" && route.startsWith("partner/")) return getPartner(request, response, routePart(route, 1));

    if (request.method === "POST" && route === "create-intasend-stk-push") return createStkPush(request, response);
    if (request.method === "POST" && route === "create-intasend-checkout") return createCheckout(request, response);
    if (request.method === "GET" && route === "deposit-status") return depositStatus(request, response);
    if (request.method === "POST" && route === "claim-deposit") return claimDeposit(request, response);
    if (request.method === "POST" && route === "intasend-webhook") return intasendWebhook(request, response);

    return response.status(404).json({ error: "API route not found." });
  } catch (error) {
    return response.status(500).json({ error: error.message || "Server error." });
  }
}

function getRoute(request) {
  const host = request.headers.host || "localhost";
  const url = new URL(request.url || "/", `https://${host}`);
  return decodeURIComponent(url.pathname.replace(/^\/api\/?/, "").replace(/\/$/, ""));
}

function routePart(route, index) {
  return decodeURIComponent(route.split("/")[index] || "");
}

async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Account service is being connected. Please try again shortly.");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI).connect();
  }

  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "metabinary");
}

async function getPaymentDb() {
  if (!process.env.MONGODB_URI) return null;

  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI).connect();
  }

  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "metabinary");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function normalizeKenyanPhone(phoneNumber) {
  const digits = String(phoneNumber || "").replace(/[^\d+]/g, "").replace(/^\+/, "");

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

function createAccountId() {
  return `MB${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
}

function createReference(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function defaultSettings(user = {}) {
  return {
    profileName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    depositPhone: user.phone || "",
    withdrawalPhone: user.phone || "",
    theme: "light",
    sound: true,
    chartSpeed: "normal",
    realTradingEnabled: false,
    dailyTradeLimit: 25,
    maximumStakeLimit: 100,
    ...(user.settings || {}),
  };
}

function publicUser(user) {
  return {
    accountId: user.accountId,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    country: user.country,
    documentType: user.documentType,
    referredBy: user.referredBy || "",
    emailVerified: Boolean(user.emailVerified),
    demoBalance: Number(user.demoBalance ?? 10000),
    realBalance: Number(user.realBalance ?? 0),
    partnerBalance: Number(user.partnerBalance ?? 0),
    partnerId: user.partnerId || "",
    referralCode: user.referralCode || "",
    settings: user.settings || defaultSettings(user),
    createdAt: user.createdAt,
  };
}

async function register(request, response) {
  const body = request.body || {};

  const fullName = String(body.fullName || "").trim();
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const country = String(body.country || "").trim();
  const documentType = String(body.documentType || "").trim();
  const password = String(body.password || "");
  const referredBy = String(body.ref || body.referredBy || "").trim();

  if (!fullName || !email || !phone || !country || !documentType || !password) {
    return response.status(400).json({ error: "Fill in all account details." });
  }

  if (password.length < 6) {
    return response.status(400).json({ error: "Password must be at least 6 characters." });
  }

  if (!body.agreed) {
    return response.status(400).json({ error: "Confirm you are 18+ and agree before creating the account." });
  }

  const db = await getDb();

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ phone: 1 }, { unique: true });

  const existing = await db.collection("users").findOne({
    $or: [{ email }, { phone }],
  });

  if (existing) {
    return response.status(409).json({
      error: existing.email === email
        ? "This email already has an account. Login instead."
        : "This phone already has an account. Login instead.",
    });
  }

  const now = new Date().toISOString();

  const user = {
    accountId: createAccountId(),
    fullName,
    email,
    phone,
    country,
    documentType,
    passwordHash: hashPassword(password),
    referredBy,
    demoBalance: 10000,
    realBalance: 0,
    partnerBalance: 0,
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  };

  user.settings = defaultSettings(user);

  await db.collection("users").insertOne(user);

  return response.status(201).json({
    user: publicUser(user),
    message: `Account ${user.accountId} created. You can login from any phone or browser.`,
  });
}

async function login(request, response) {
  const email = normalizeEmail(request.body?.email);
  const password = String(request.body?.password || "");

  if (!email || !password) {
    return response.status(400).json({ error: "Enter your email and password." });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return response.status(401).json({ error: "Email or password is not correct." });
  }

  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { lastLoginAt: new Date().toISOString() } }
  );

  return response.status(200).json({
    user: publicUser(user),
    message: `Logged in as ${user.accountId}.`,
  });
}

async function resetPassword(request, response) {
  const email = normalizeEmail(request.body?.email);

  if (!email) {
    return response.status(400).json({ error: "Enter your email first." });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  return response.status(200).json({
    exists: Boolean(user),
    message: user
      ? "Password reset request received. Email sending can be connected next."
      : "If the email exists, a reset message will be prepared.",
  });
}

async function verifyEmail(request, response) {
  const email = normalizeEmail(request.body?.email);
  const db = await getDb();

  const result = await db.collection("users").findOneAndUpdate(
    { email },
    {
      $set: {
        emailVerified: true,
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    { returnDocument: "after" }
  );

  const user = result?.value || result;

  if (!user) {
    return response.status(404).json({ error: "Account not found." });
  }

  return response.status(200).json({
    user: publicUser(user),
    message: "Email verified.",
  });
}

async function getUser(request, response, emailParam) {
  const email = normalizeEmail(emailParam);
  const db = await getDb();

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return response.status(404).json({ error: "Account not found." });
  }

  if (!user.settings) {
    user.settings = defaultSettings(user);
    await db.collection("users").updateOne({ email }, { $set: { settings: user.settings } });
  }

  return response.status(200).json({ user: publicUser(user) });
}

async function saveSettings(request, response, emailParam) {
  const email = normalizeEmail(emailParam);
  const body = request.body || {};
  const incoming = body.settings || body;

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return response.status(404).json({ error: "Account not found." });
  }

  const settings = {
    ...defaultSettings(user),
    profileName: String(incoming.profileName || user.fullName || "").trim(),
    email,
    phone: String(incoming.phone || user.phone || "").trim(),
    depositPhone: String(incoming.depositPhone || "").trim(),
    withdrawalPhone: String(incoming.withdrawalPhone || "").trim(),
    theme: incoming.theme === "dark" ? "dark" : "light",
    sound: incoming.sound !== false,
    chartSpeed: ["slow", "normal", "fast"].includes(incoming.chartSpeed) ? incoming.chartSpeed : "normal",
    realTradingEnabled: Boolean(incoming.realTradingEnabled),
    dailyTradeLimit: Math.max(1, Number(incoming.dailyTradeLimit) || 25),
    maximumStakeLimit: Math.max(0.3, Number(incoming.maximumStakeLimit) || 100),
  };

  const update = {
    fullName: settings.profileName,
    phone: settings.phone,
    settings,
    updatedAt: new Date().toISOString(),
  };

  if (body.newPassword || incoming.newPassword) {
    update.passwordHash = hashPassword(String(body.newPassword || incoming.newPassword));
  }

  await db.collection("users").updateOne({ email }, { $set: update });

  const updated = await db.collection("users").findOne({ email });

  return response.status(200).json({
    user: publicUser(updated),
    message: "Settings saved.",
  });
}

async function getTransactions(request, response, emailParam) {
  const email = normalizeEmail(emailParam);
  const db = await getDb();

  const transactions = await db
    .collection("transactions")
    .find({ email })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return response.status(200).json({ transactions });
}

async function withdraw(request, response) {
  const body = request.body || {};

  const email = normalizeEmail(body.email);
  const amount = Number(body.amount);
  const phone = normalizePhone(body.phone);

  if (!email || !phone || !Number.isFinite(amount)) {
    return response.status(400).json({ error: "Enter withdrawal email, phone, and amount." });
  }

  if (amount < 5) {
    return response.status(400).json({ error: "Minimum withdrawal is 5 USD." });
  }

  if (amount > 150000) {
    return response.status(400).json({ error: "Maximum withdrawal is 150000 USD." });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return response.status(404).json({ error: "Account not found." });
  }

  if (Number(user.realBalance || 0) < amount) {
    return response.status(400).json({ error: "Real balance is not enough for this withdrawal." });
  }

  const createdAt = new Date().toISOString();
  const balanceAfter = Number((Number(user.realBalance || 0) - amount).toFixed(2));

  await db.collection("users").updateOne(
    { email },
    {
      $inc: { realBalance: -amount },
      $set: { updatedAt: createdAt },
    }
  );

  const transaction = {
    email,
    type: "withdrawal",
    amount,
    phone,
    status: "pending",
    accountType: "Real",
    balanceAfter,
    reference: createReference("wd"),
    message: "Withdrawal request created. Balance updated immediately while payout is processed.",
    createdAt,
  };

  await db.collection("transactions").insertOne(transaction);
  await db.collection("withdrawals").insertOne(transaction);

  const updated = await db.collection("users").findOne({ email });

  return response.status(200).json({
    user: publicUser(updated),
    transaction,
    message: transaction.message,
  });
}

async function recordTrade(request, response) {
  const body = request.body || {};

  const email = normalizeEmail(body.email);
  const accountType = body.accountType === "Real" ? "Real" : "Demo";
  const stake = Number(body.stake || 0);
  const profit = Number(body.profit || 0);
  const balanceAfter = Number(body.balanceAfter || 0);

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return response.status(404).json({ error: "Account not found." });
  }

  const transaction = {
    email,
    type: "trade",
    tradeType: String(body.tradeType || ""),
    amount: stake,
    profit,
    status: profit >= 0 ? "win" : "loss",
    accountType,
    balanceAfter,
    reference: createReference("trade"),
    createdAt: new Date().toISOString(),
  };

  await db.collection("transactions").insertOne(transaction);

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
    const amount = Number((Math.abs(profit) * 0.05).toFixed(2));

    const commission = {
      partnerId: user.referredBy,
      referralEmail: email,
      amount,
      status: "pending",
      source: "real-trade-broker-revenue",
      reference: createReference("com"),
      createdAt: new Date().toISOString(),
    };

    await db.collection("commissions").insertOne(commission);
    await db.collection("users").updateOne({ partnerId: user.referredBy }, { $inc: { partnerBalance: amount } });
  }

  return response.status(200).json({ transaction });
}

async function partnerApply(request, response) {
  const email = normalizeEmail(request.body?.email);
  const db = await getDb();

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return response.status(404).json({ error: "Account not found." });
  }

  const partnerId = user.partnerId || createReference("partner").replace(/-/g, "").toUpperCase();
  const origin = request.headers.origin || `https://${request.headers.host || "metabinary-cewf.vercel.app"}`;

  const partner = {
    email,
    partnerId,
    referralCode: user.referralCode || partnerId,
    referralLink: `${origin}/register?ref=${partnerId}`,
    status: "approved",
    createdAt: user.partnerCreatedAt || new Date().toISOString(),
  };

  await db.collection("users").updateOne(
    { email },
    {
      $set: {
        partnerId,
        referralCode: partner.referralCode,
        partnerCreatedAt: partner.createdAt,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  await db.collection("partners").updateOne({ partnerId }, { $set: partner }, { upsert: true });

  const updated = await db.collection("users").findOne({ email });

  return response.status(200).json({
    partner,
    user: publicUser(updated),
    message: "Partner account is active.",
  });
}

async function getPartner(request, response, emailParam) {
  const email = normalizeEmail(emailParam);
  const db = await getDb();

  const user = await db.collection("users").findOne({ email });

  if (!user?.partnerId) {
    return response.status(404).json({ error: "Partner account not found." });
  }

  const origin = request.headers.origin || `https://${request.headers.host || "metabinary-cewf.vercel.app"}`;

  const partner =
    (await db.collection("partners").findOne({ partnerId: user.partnerId })) ||
    {
      email,
      partnerId: user.partnerId,
      referralCode: user.referralCode,
      referralLink: `${origin}/register?ref=${user.partnerId}`,
    };

  const referrals = await db.collection("users").find({ referredBy: user.partnerId }).toArray();
  const referralEmails = referrals.map((item) => item.email);

  const transactions = await db.collection("transactions").find({ email: { $in: referralEmails } }).toArray();
  const commissions = await db.collection("commissions").find({ partnerId: user.partnerId }).toArray();

  const realDeposits = transactions.filter((item) => item.type === "deposit" && item.accountType === "Real");
  const realTrades = transactions.filter((item) => item.type === "trade" && item.accountType === "Real");

  return response.status(200).json({
    partner,
    stats: {
      totalReferredUsers: referrals.length,
      activeRealTraders: new Set(realTrades.map((item) => item.email)).size,
      totalRealDeposits: sum(realDeposits.map((item) => item.amount)),
      totalRealTradeVolume: sum(realTrades.map((item) => Math.abs(item.amount))),
      totalCommissionEarned: sum(commissions.map((item) => item.amount)),
      pendingCommission: sum(commissions.filter((item) => item.status === "pending").map((item) => item.amount)),
      paidCommission: sum(commissions.filter((item) => item.status === "paid").map((item) => item.amount)),
    },
  });
}

async function partnerReferrals(request, response, partnerId) {
  const db = await getDb();

  const referrals = await db
    .collection("users")
    .find({ referredBy: partnerId }, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return response.status(200).json({ referrals });
}

async function partnerCommissions(request, response, partnerId) {
  const db = await getDb();

  const commissions = await db
    .collection("commissions")
    .find({ partnerId })
    .sort({ createdAt: -1 })
    .toArray();

  return response.status(200).json({ commissions });
}

async function partnerWithdraw(request, response) {
  const email = normalizeEmail(request.body?.email);
  const amount = Number(request.body?.amount);
  const phone = normalizePhone(request.body?.phone);

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user?.partnerId) {
    return response.status(404).json({ error: "Partner account not found." });
  }

  if (!Number.isFinite(amount) || amount < 5) {
    return response.status(400).json({ error: "Minimum partner withdrawal is 5 USD." });
  }

  if (Number(user.partnerBalance || 0) < amount) {
    return response.status(400).json({ error: "Partner balance is not enough." });
  }

  const createdAt = new Date().toISOString();

  await db.collection("users").updateOne(
    { email },
    {
      $inc: { partnerBalance: -amount },
      $set: { updatedAt: createdAt },
    }
  );

  const transaction = {
    email,
    partnerId: user.partnerId,
    type: "partner-withdrawal",
    amount,
    phone,
    status: "pending",
    accountType: "Partner",
    balanceAfter: Number((Number(user.partnerBalance || 0) - amount).toFixed(2)),
    reference: createReference("pwd"),
    createdAt,
  };

  await db.collection("transactions").insertOne(transaction);

  return response.status(200).json({
    transaction,
    message: "Partner withdrawal request is pending.",
  });
}

async function createStkPush(request, response) {
  const publicKey = process.env.INTASEND_PUBLISHABLE_KEY || process.env.INTASEND_PUBLIC_KEY;
  const secretKey = process.env.INTASEND_SECRET_KEY || process.env.INTASEND_PRIVATE_KEY || process.env.INTASEND_TOKEN;

  if (!publicKey || !secretKey) {
    return response.status(500).json({ error: "Payment keys are not configured." });
  }

  const body = request.body || {};

  const amount = Number(body.amount);
  const usdAmount = Number(body.usd_amount);
  const accountId = String(body.account_id || "").trim();
  const phoneNumber = normalizeKenyanPhone(body.phone_number);
  const email = normalizeEmail(body.email || "customer@example.com");

  if (!Number.isFinite(amount) || amount < 10) {
    return response.status(400).json({ error: "Enter an amount of at least 10." });
  }

  if (!Number.isFinite(usdAmount) || usdAmount <= 0) {
    return response.status(400).json({ error: "Enter a valid USD amount." });
  }

  if (!/^254[17]\d{8}$/.test(phoneNumber)) {
    return response.status(400).json({ error: "Use phone format 0712345678 or 254712345678." });
  }

  const apiRef = `stk-${Date.now()}`;
  const origin = request.headers.origin || `https://${request.headers.host || "metabinary-cewf.vercel.app"}`;
  const webhookUrl = process.env.INTASEND_WEBHOOK_URL || `${origin}/api/intasend-webhook`;

  const payload = {
    public_key: publicKey,
    amount,
    currency: process.env.INTASEND_CURRENCY || "KES",
    phone_number: phoneNumber,
    email,
    first_name: "Trading",
    last_name: "Customer",
    host: request.headers.host || "metabinary-cewf.vercel.app",
    api_ref: apiRef,
    comment: "Trading account deposit",
    callback_url: webhookUrl,
    webhook_url: webhookUrl,
  };

  const endpoints = [
    "https://payment.intasend.com/api/v1/payment/mpesa-stk-push/",
    "https://payment.intasend.com/api/v1/mpesa/stk-push/",
    "https://payment.intasend.com/api/v1/collection/mpesa-stk-push/",
  ];

  for (const endpoint of endpoints) {
    const stkResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await stkResponse.json().catch(() => ({}));

    if (stkResponse.ok) {
      await savePendingDeposit({
        apiRef,
        accountId,
        email,
        phoneNumber,
        kesAmount: amount,
        usdAmount,
        intasend: data,
      });

      return response.status(200).json({
        api_ref: apiRef,
        usd_amount: usdAmount,
        kes_amount: amount,
        message: process.env.MONGODB_URI
          ? "M-Pesa STK push sent. Balance will update after payment is confirmed."
          : "M-Pesa STK push sent. Payment confirmation is being connected.",
        data,
      });
    }

    if (stkResponse.status !== 404) {
      return response.status(stkResponse.status).json({
        error: readIntasendError(data),
        details: data,
      });
    }
  }

  return response.status(502).json({
    error: "M-Pesa STK endpoint was not found. Check the IntaSend API path for your account.",
  });
}

async function createCheckout(request, response) {
  const publicKey = process.env.INTASEND_PUBLISHABLE_KEY || process.env.INTASEND_PUBLIC_KEY;
  const secretKey = process.env.INTASEND_SECRET_KEY || process.env.INTASEND_PRIVATE_KEY || process.env.INTASEND_TOKEN;

  if (!publicKey || !secretKey) {
    return response.status(500).json({ error: "Payment keys are not configured." });
  }

  const amount = Number(request.body?.amount);
  const phoneNumber = String(request.body?.phone_number || "").trim();
  const email = normalizeEmail(request.body?.email);

  if (!Number.isFinite(amount) || amount < 10) {
    return response.status(400).json({ error: "Enter an amount of at least 10." });
  }

  if (!phoneNumber || !email) {
    return response.status(400).json({ error: "Phone number and email are required." });
  }

  const origin = request.headers.origin || `https://${request.headers.host}`;
  const apiRef = `deposit-${Date.now()}`;

  const checkoutResponse = await fetch("https://payment.intasend.com/api/v1/checkout/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public_key: publicKey,
      amount,
      currency: process.env.INTASEND_CURRENCY || "KES",
      email,
      phone_number: phoneNumber,
      api_ref: apiRef,
      redirect_url: `${origin}/`,
      comment: "Trading account deposit",
    }),
  });

  const data = await checkoutResponse.json().catch(() => ({}));

  if (!checkoutResponse.ok) {
    return response.status(checkoutResponse.status).json({
      error: data.detail || data.error || "IntaSend checkout failed.",
      details: data,
    });
  }

  return response.status(200).json({
    api_ref: apiRef,
    checkout_url: data.url || data.checkout_url || data.invoice_url,
    data,
  });
}

async function savePendingDeposit(deposit) {
  const db = await getPaymentDb();

  if (!db) return;

  await db.collection("deposits").updateOne(
    { apiRef: deposit.apiRef },
    {
      $setOnInsert: {
        ...deposit,
        status: "pending",
        credited: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

async function depositStatus(request, response) {
  const apiRef = String(request.query?.api_ref || "").trim();

  if (!apiRef) {
    return response.status(400).json({ error: "Missing deposit reference." });
  }

  const db = await getPaymentDb();

  if (!db) {
    return response.status(200).json({
      api_ref: apiRef,
      status: "pending",
      confirmed: false,
      credited: false,
      message: "Payment is pending while confirmation is being connected.",
    });
  }

  let deposit = await db.collection("deposits").findOne({ apiRef });

  if (!deposit) {
    return response.status(404).json({ error: "Deposit was not found yet." });
  }

  if (deposit.status === "completed" && !deposit.credited) {
    const credit = await creditDeposit(db, deposit);
    deposit = credit.deposit || deposit;

    return response.status(200).json({
      api_ref: deposit.apiRef,
      account_id: deposit.accountId,
      status: deposit.status,
      confirmed: true,
      credited: Boolean(deposit.credited),
      usd_amount: deposit.usdAmount,
      kes_amount: deposit.kesAmount,
      user: credit.user ? publicUser(credit.user) : null,
      message: deposit.credited
        ? "Payment confirmed and credited."
        : "Payment confirmed. Credit is being completed.",
    });
  }

  return response.status(200).json({
    api_ref: deposit.apiRef,
    account_id: deposit.accountId,
    status: deposit.status,
    confirmed: deposit.status === "completed",
    credited: Boolean(deposit.credited),
    usd_amount: deposit.usdAmount,
    kes_amount: deposit.kesAmount,
    user: null,
    message: deposit.status === "completed" ? "Payment confirmed." : "Waiting for M-Pesa confirmation.",
  });
}

async function claimDeposit(request, response) {
  const apiRef = String(request.body?.api_ref || "").trim();
  const accountId = String(request.body?.account_id || "").trim();

  if (!apiRef || !accountId) {
    return response.status(400).json({ error: "Missing deposit reference or account." });
  }

  const db = await getPaymentDb();

  if (!db) {
    return response.status(500).json({ error: "Payment confirmation is being connected. Please try again shortly." });
  }

  const deposit = await db.collection("deposits").findOne({
    apiRef,
    accountId,
    status: "completed",
  });

  if (!deposit) {
    return response.status(409).json({ error: "Deposit is not confirmed yet." });
  }

  const credit = await creditDeposit(db, deposit);

  if (!credit.deposit?.credited) {
    return response.status(409).json({ error: "Deposit was already credited or could not be credited." });
  }

  return response.status(200).json({
    api_ref: credit.deposit.apiRef,
    account_id: credit.deposit.accountId,
    usd_amount: credit.deposit.usdAmount,
    kes_amount: credit.deposit.kesAmount,
    credited: true,
    user: credit.user ? publicUser(credit.user) : null,
    transaction: credit.transaction,
    message: "Deposit credited.",
  });
}

async function creditDeposit(db, deposit) {
  if (!deposit || deposit.credited) {
    return {
      deposit,
      user: null,
      transaction: null,
      credited: Boolean(deposit?.credited),
    };
  }

  const result = await db.collection("deposits").findOneAndUpdate(
    {
      apiRef: deposit.apiRef,
      status: "completed",
      credited: false,
    },
    {
      $set: {
        credited: true,
        creditedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  const creditedDeposit = result?.value || result;

  if (!creditedDeposit) {
    return {
      deposit,
      user: null,
      transaction: null,
      credited: false,
    };
  }

  let updatedUser = null;
  let transaction = null;

  if (creditedDeposit.email) {
    const user = await db.collection("users").findOne({ email: creditedDeposit.email });
    const usdAmount = Number(creditedDeposit.usdAmount || 0);
    const balanceAfter = Number((Number(user?.realBalance || 0) + usdAmount).toFixed(2));

    await db.collection("users").updateOne(
      { email: creditedDeposit.email },
      {
        $inc: { realBalance: usdAmount },
        $set: { updatedAt: new Date().toISOString() },
      }
    );

    transaction = {
      email: creditedDeposit.email,
      type: "deposit",
      amount: usdAmount,
      kesAmount: Number(creditedDeposit.kesAmount || 0),
      phone: creditedDeposit.phoneNumber,
      status: "completed",
      accountType: "Real",
      balanceAfter,
      reference: creditedDeposit.apiRef || createReference("dep"),
      createdAt: new Date().toISOString(),
    };

    await db.collection("transactions").updateOne(
      { reference: transaction.reference },
      { $setOnInsert: transaction },
      { upsert: true }
    );

    updatedUser = await db.collection("users").findOne({ email: creditedDeposit.email });
  }

  return {
    deposit: creditedDeposit,
    user: updatedUser,
    transaction,
    credited: true,
  };
}

async function intasendWebhook(request, response) {
  const db = await getPaymentDb();

  if (!db) {
    return response.status(500).json({ error: "Payment confirmation is not ready yet." });
  }

  const payload = request.body || {};
  const apiRef = String(readWebhookApiRef(payload)).trim();
  const status = readWebhookStatus(payload);

  if (!apiRef) {
    return response.status(400).json({ error: "Missing api_ref." });
  }

  const update = {
    status: isPaidStatus(status) ? "completed" : String(status || "pending"),
    webhookStatus: status || "",
    webhookPayload: payload,
    updatedAt: new Date(),
  };

  if (isPaidStatus(status)) {
    update.confirmedAt = new Date();
  }

  const result = await db.collection("deposits").findOneAndUpdate(
    { apiRef },
    { $set: update },
    { returnDocument: "after" }
  );

  const deposit = result?.value || result;

  let credit = null;

  if (isPaidStatus(status) && deposit && !deposit.credited) {
    credit = await creditDeposit(db, deposit);
  }

  return response.status(200).json({
    received: true,
    api_ref: apiRef,
    status: update.status,
    known_deposit: Boolean(deposit),
    credited: Boolean(credit?.credited),
  });
}

function readWebhookApiRef(payload) {
  return (
    payload?.api_ref ||
    payload?.apiRef ||
    payload?.invoice?.api_ref ||
    payload?.payment?.api_ref ||
    payload?.data?.api_ref ||
    payload?.data?.invoice?.api_ref ||
    ""
  );
}

function readWebhookStatus(payload) {
  return (
    payload?.state ||
    payload?.status ||
    payload?.payment_status ||
    payload?.invoice?.state ||
    payload?.invoice?.status ||
    payload?.payment?.state ||
    payload?.payment?.status ||
    payload?.data?.state ||
    payload?.data?.status ||
    payload?.data?.invoice?.state ||
    payload?.data?.invoice?.status ||
    ""
  );
}

function isPaidStatus(value) {
  const status = String(value || "").toLowerCase();
  return ["complete", "completed", "paid", "success", "successful", "confirmed"].some((word) => status.includes(word));
}

function readIntasendError(data) {
  if (!data || typeof data !== "object") return "M-Pesa STK push failed.";
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.error === "string") return data.error;
  if (typeof data.message === "string") return data.message;

  const fieldErrors = Object.entries(data)
    .map(([field, value]) => {
      if (Array.isArray(value)) return `${field}: ${value.join(", ")}`;
      if (typeof value === "string") return `${field}: ${value}`;
      return "";
    })
    .filter(Boolean);

  return fieldErrors[0] || "M-Pesa STK push failed.";
}

function sum(values) {
  return Number(values.reduce((total, value) => total + Number(value || 0), 0).toFixed(2));
}
