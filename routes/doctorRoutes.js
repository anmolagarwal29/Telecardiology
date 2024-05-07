import express from "express";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.get("/get-doctors", async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
    });
    return res.status(200).json({
      doctors,
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

router.get("/get-user/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the route parameters
    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        status: 404,
      });
    }

    return res.status(200).json({
      user,
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

router.post("/add-prescription", async (req, res) => {
  const { appointment_id, prescription } = req.body;
  try {
    Appointment.updateOne(
      { _id: appointment_id },
      {
        prescription: { ...prescription, timestamp: new Date() },
      }
    ).then(() => {
      return res.status(200).json({
        message: "Prescription saved!",
        status: 200,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "An error occurred",
      status: 500,
    });
  }
});

router.put("/update-user/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the route parameters

  try {
    // Retrieve user data from the request body
    const { name, email, phone, area, address } = req.body;

    // Find the user by ID and update their details
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        area,
        address,
      },
      { new: true }
    ); // {new: true} ensures the method returns the updated object

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        status: 404,
      });
    }

    // Respond with the updated user data
    return res.status(200).json({
      message: "User updated successfully",
      user,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    // Handle possible errors, such as database connection errors
    return res.status(500).json({
      error: "An error occurred during the update",
      status: 500,
    });
  }
});

export default router;
