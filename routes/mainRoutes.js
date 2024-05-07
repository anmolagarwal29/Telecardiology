import express from "express";
import Query from "../models/Query.js";

const router = express.Router();

router.get("/get-queries", async (req, res) => {
  try {
    const queries = await Query.find();
    return res.status(200).json({
      queries,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred",
      status: 500,
    });
  }
});

router.post("/contact-us", async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!email || !name || !message) {
    return res.status(422).json({
      error: "Missing Fields",
      status: 422,
    });
  }
  const query = new Query({
    name,
    email,
    phone: phone || "",
    message,
  });
  try {
    query.save();
    return res.status(200).json({
      message: "Form submitted successfully",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "An error occurred",
      status: 500,
    });
  }
});

export default router;
