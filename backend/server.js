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

console.log("MONGO_URI:", !!process.env.MONGO_URI);
console.log("INTASEND_SECRET_KEY:", !!process.env.INTASEND_SECRET_KEY);
console.log("INTASEND_PUBLISHABLE_KEY:", !!process.env.INTASEND_PUBLISHABLE_KEY);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err.message));

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  demoBalance: { type: Number, default: 10000 },
  realBalance: { type: Number, default: 0 },
});

const DepositSchema = new mongoose.Schema({
  email: String,
  phone: String,
  usdAmount: Number,
  kesAmount: Number,
  status: { type: String, default: "PENDING" },
  credited: { type: Boolean, default: false },
  invoice_id: String,
  api_ref: String,
  intasendResponse: Object,
});

const User = mongoose.model("User", UserSchema);
const Deposit = mongoose.model("Deposit", DepositSchema);

app.get("/", (req, res) => {
  res.send("MetaBinary Backend Running");
});

app.get("/api/user/:email", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.params.email });

    if (!user) {
      user = await User.create({ email: req.params.email });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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

    const cleanPhone = String(phone).replace(/\D/g, "");
    const usdAmount = Number(amount);
    const kesAmount = Math.round(usdAmount * USD_RATE);

    if (!cleanPhone.startsWith("254") || cleanPhone.length < 12) {
      return res.status(400).json({
        success: false,
        message: "Use phone format 2547XXXXXXXX",
      });
    }

    const api_ref = "MB-" + Date.now();

    const deposit = await Deposit.create({
      email,
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
          email,
          api_ref,
          callback_url:
            process.env.CALLBACK_URL ||
            "https://metabinary-3.onrender.com/api/payment/callback",
        }),
      }
    );

    const stkData = await stkRes.json();
    console.log("INTASEND RESPONSE:", stkData);

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
    console.log("CALLBACK:", req.body);

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

    if (
      ["COMPLETE", "COMPLETED", "PAID", "SUCCESS", "SUCCESSFUL"].includes(
        state
      )
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
        await deposit.save();
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.log("CALLBACK ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
