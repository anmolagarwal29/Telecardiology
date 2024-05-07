import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const paymentCapture = 1; // Set to 1 to auto-capture the payment
    const amount = 50000; // Amount in the smallest currency unit (e.g., 500 paise for INR 5)
    const currency = "INR";

    const response = await razorpayInstance.orders.create({
      amount,
      currency,
      payment_capture: paymentCapture,
    });

    return res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
});

export default router;
