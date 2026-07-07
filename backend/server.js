import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const USD_RATE = Number(process.env.USD_RATE || 130);

const cleanEnv = (value) => {
  if (!value) return "";
  return String(value)
    .trim()
    .replace(/^MONGO_URI=/, "")
    .replace(/^["']|["']$/g, "");
};

const MONGO_URI = cleanEnv(process.env.MONGO_URI);

console.log("MONGO_URI exists:", !!MONGO_URI);
console.log("MONGO_URI starts correctly:", MONGO_URI.startsWith("mongodb+srv://"));
console.log("INTASEND_SECRET_KEY:", !!process.env.INTASEND_SECRET_KEY);
console.log("INTASEND_PUBLISHABLE_KEY:", !!process.env.INTASEND_PUBLISHABLE_KEY);

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err.message));

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    demoBalance: { type: Number, default: 10000 },
    realBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DepositSchema = new mongoose.Schema(
  {
    email: String,
    phone: String,
    usdAmount: Number,
    kesAmount: Number,
    status: { type: String, default: "PENDING" },
    credited: { type: Boolean, default: false },
    invoice_id: String,
    api_ref: String,
    intasendResponse: Object,
    callbackBody: Object,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const Deposit = mongoose.model("Deposit", DepositSchema);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MetaBinary Backend Running",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "not connected",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    mongo: mongoose.connection.readyState === 1 ? "connected" : "not connected",
    mongoUriExists: !!MONGO_URI,
    mongoUriStartsCorrectly: MONGO_URI.startsWith("mongodb+srv://"),
    intasendSecret: !!process.env.INTASEND_SECRET_KEY,
    intasendPublic: !!process.env.INTASEND_PUBLISHABLE_KEY,
  });
});

app.get("/api/user/:email", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "MongoDB not connected. Check MONGO_URI in Render.",
      });
    }

    const email = String(req.params.email).toLowerCase().trim();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/deposit", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "MongoDB not connected. Check MONGO_URI in Render.",
      });
    }

    const { email, phone, amount } = req.body;

    if (!email || !phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Email, phone and amount required",
      });
    }

    if (!process.env.INTASEND_SECRET_KEY || !process.env.INTASEND_PUBLISHABLE_KEY) {
      return res.status(500).json({
        success: false,
        message: "IntaSend keys missing in Render Environment",
      });
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    const usdAmount = Number(amount);
    const kesAmount = Math.round(usdAmount * USD_RATE);
    const userEmail = String(email).toLowerCase().trim();

    if (!cleanPhone.startsWith("254") || cleanPhone.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Use phone format 2547XXXXXXXX",
      });
    }

    if (!usdAmount || usdAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid amount",
      });
    }

    const api_ref = "MB-" + Date.now();

    const deposit = await Deposit.create({
      email: userEmail,
      phone: cleanPhone,
      usdAmount,
      kesAmount,
      api_ref,
    });

    const stkRes = await fetch(
      "https://payment.intasend.com/api/v1/payment/mpesa-stk-push/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.INTASEND_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_key: process.env.INTASEND_PUBLISHABLE_KEY,
          amount: kesAmount,
          currency: "KES",
          phone_number: cleanPhone,
          email: userEmail,
          api_ref,
          callback_url:
            process.env.CALLBACK_URL ||
            "https://metabinary-3.onrender.com/api/payment/callback",
        }),
      }
    );

    const stkData = await stkRes.json();
    console.log("INTASEND RESPONSE:", JSON.stringify(stkData, null, 2));

    deposit.invoice_id = stkData.invoice_id || stkData.id || "";
    deposit.intasendResponse = stkData;
    await deposit.save();

    if (!stkRes.ok) {
      return res.status(400).json({
        success: false,
        message:
          stkData.message ||
          stkData.detail ||
          stkData.error ||
          stkData.errors?.[0]?.detail ||
          "STK push failed",
        data: stkData,
      });
    }

    res.json({
      success: true,
      message: "STK push sent. Check your phone.",
      deposit,
      data: stkData,
    });
  } catch (err) {
    console.log("DEPOSIT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/payment/callback", async (req, res) => {
  try {
    console.log("CALLBACK:", JSON.stringify(req.body, null, 2));

    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "MongoDB not connected",
      });
    }

    const body = req.body;

    const api_ref = body.api_ref || body.reference;
    const invoice_id = body.invoice_id || body.id;
    const state = String(body.state || body.status || "").toUpperCase();

    const deposit = await Deposit.findOne({
      $or: [{ api_ref }, { invoice_id }],
    });

    if (!deposit) {
      return res.json({ success: true, message: "Deposit not found" });
    }

    deposit.callbackBody = body;

    if (
      ["COMPLETE", "COMPLETED", "PAID", "SUCCESS", "SUCCESSFUL"].includes(state)
    ) {
      if (!deposit.credited) {
        let user = await User.findOne({ email: deposit.email });

        if (!user) {
          user = await User.create({ email: deposit.email });
        }

        user.realBalance += Number(deposit.usdAmount);
        await user.save();

        deposit.status = "PAID";
        deposit.credited = true;
      }
    } else {
      deposit.status = state || "FAILED";
    }

    await deposit.save();

    res.json({ success: true });
  } catch (err) {
    console.log("CALLBACK ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
