import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const UserSchema = new mongoose.Schema({
  email: String,
  demoBalance: { type: Number, default: 10000 },
  realBalance: { type: Number, default: 0 },
});

const DepositSchema = new mongoose.Schema({
  email: String,
  phone: String,
  amount: Number,
  status: { type: String, default: "PENDING" },
  invoice_id: String,
  api_ref: String,
});

const User = mongoose.model("User", UserSchema);
const Deposit = mongoose.model("Deposit", DepositSchema);

app.get("/", (req, res) => {
  res.send("MetaBinary Backend Running");
});

app.get("/api/user/:email", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });

  if (!user) {
    user = await User.create({ email: req.params.email });
  }

  res.json(user);
});

app.post("/api/deposit", async (req, res) => {
  try {
    const { email, phone, amount } = req.body;

    if (!email || !phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Email, phone and amount required",
      });
    }

    const api_ref = "MB-" + Date.now();

    const deposit = await Deposit.create({
      email,
      phone,
      amount: Number(amount),
      api_ref,
    });

    const stkRes = await fetch("https://payment.intasend.com/api/v1/payment/mpesa-stk-push/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.INTASEND_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_key: process.env.INTASEND_PUBLISHABLE_KEY,
        amount: Number(amount),
        phone_number: phone,
        email,
        api_ref,
        callback_url: process.env.CALLBACK_URL,
      }),
    });

    const stkData = await stkRes.json();

    deposit.invoice_id = stkData.invoice_id || stkData.id || "";
    await deposit.save();

    if (!stkRes.ok) {
      return res.status(400).json({
        success: false,
        message: stkData.message || "STK push failed",
        data: stkData,
      });
    }

    res.json({
      success: true,
      message: "STK push sent. Check your phone.",
      data: stkData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/payment/callback", async (req, res) => {
  try {
    const body = req.body;

    const api_ref = body.api_ref;
    const state = body.state || body.status;
    const invoice_id = body.invoice_id || body.id;

    const deposit = await Deposit.findOne({
      $or: [{ api_ref }, { invoice_id }],
    });

    if (!deposit) {
      return res.json({ success: true, message: "Deposit not found" });
    }

    if (
      String(state).toUpperCase() === "COMPLETE" ||
      String(state).toUpperCase() === "PAID" ||
      String(state).toUpperCase() === "SUCCESS"
    ) {
      deposit.status = "PAID";
      await deposit.save();

      let user = await User.findOne({ email: deposit.email });

      if (!user) {
        user = await User.create({ email: deposit.email });
      }

      user.realBalance += Number(deposit.amount);
      await user.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
