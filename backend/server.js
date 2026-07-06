import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("MONGO_URI exists:", Boolean(process.env.MONGO_URI));

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  demoBalance: { type: Number, default: 10000 },
  realBalance: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("MetaBinary Backend Running");
});

app.get("/api/user/:email", async (req, res) => {
  try {
    const email = req.params.email;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: "MetaBinary User",
        email,
        password: "123456",
        demoBalance: 10000,
        realBalance: 0,
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/deposit", async (req, res) => {
  try {
    const { email, amount, phone } = req.body;

    if (!email || !amount) {
      return res.json({
        success: false,
        message: "Email and amount required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: "MetaBinary User",
        email,
        password: "123456",
        demoBalance: 10000,
        realBalance: 0,
      });
    }

    user.realBalance += Number(amount);
    await user.save();

    res.json({
      success: true,
      message: `Deposit received from ${phone || "user"}`,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
