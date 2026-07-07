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
  res.status(200).json({
    success: true,
    message: "MetaBinary API is healthy",
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
      email
