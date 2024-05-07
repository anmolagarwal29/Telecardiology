import express, { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import bcrypt from "bcrypt";
import mailer from "../utils/mailer.js";
import { emailMessage } from "../utils/constants.js";

const router = express.Router();
const JWT_SECRET_KEY = "anmol123";

router.post("/login", async (req, res) => {
  const { input, password } = req.body;

  // Check if both input and password are provided
  if (!input || !password) {
    return res.status(400).json({
      error: "Missing fields",
      status: 400,
    });
  }

  try {
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: input }, { phone: input }],
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        status: 401,
      });
    }

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
        status: 401,
      });
    }

    // Construct token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY);

    // Exclude sensitive information
    const { password: pwd, ...userInfo } = user.toObject();
    // Respond with user info, token, and associated batches
    return res.status(200).json({
      user: {
        ...userInfo,
      },
      message: "User logged in successfully",
      status: 200,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred",
      status: 500,
    });
  }
});

router.post("/register", (req, res) => {
  //input validations
  const {
    name,
    email,
    password,
    confirm_password,
    phone,
    address,
    area,
    role,
  } = req.body;
  if (!email || !name || !phone || !confirm_password || !password) {
    return res.status(422).json({
      error: errors.missingFields,
      status: 422,
    });
  }
  if (password !== confirm_password) {
    return res.status(422).json({
      error: "Password and Confirm Password do not match",
      status: 422,
    });
  }

  //check for duplicates
  User.findOne({ $or: [{ email: email }, { phone: phone }] })
    .then(async (savedUser) => {
      let status, response;
      if (savedUser) {
        return res.status(422).json({
          error: "A user already exists with this Email Address or Phone",
          status: 422,
        });
      } else {
        const user = new User({
          name: name,
          email: email,
          password: password,
          phone: phone,
          address: address,
          area,
          role: role ?? "patient",
        });

        //post in db
        try {
          user.save();
          await mailer(emailMessage({ user, action: "register" }));
          const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY);
          status = 200;
          response = {
            message: "User registered successfully",
            _id: user._id,
            status: 200,
            token,
            user,
          };
        } catch (err) {
          console.log(err);
          return res
            .status(422)
            .json({ error: "Something Went Wrong", status: 422 });
        }
      }
      return res.status(status).json(response);
    })
    .catch((err) => {
      return res.status(422).json({
        error: "Something Went Wrong",
        status: 422,
      });
    });
});

router.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user and their appointments
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Delete all related doctor and patient appointments
    await Appointment.deleteMany({
      _id: { $in: user.doctorAppointment.concat(user.patientAppointment) },
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.send({ message: "User and related appointments deleted successfully" });
  } catch (error) {
    // Handle any errors that might occur during the transaction

    console.error("Failed to delete user and appointments:", error);
    res.status(500).send({ message: "Failed to delete user and appointments" });
  }
});

export default router;
