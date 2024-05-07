import express from "express";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import { emailMessage } from "../utils/constants.js";
import mailer from "../utils/mailer.js";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import multer from "multer";

dotenv.config();
const router = express.Router();

AWS.config.update({
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/get-doctor-patients/:doctorId", async (req, res) => {
  const doctorId = req.params.doctorId;
  try {
    const appointments = await Appointment.find({ doctor: doctorId }).populate(
      "patient"
    );

    // Map the appointments to extract patient data
    const patientIds = appointments.map((appointment) => appointment.patient);

    // Fetch all unique patient details from the User collection
    const patients = await User.find({ _id: { $in: patientIds } });

    return res.status(200).json({
      patients,
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

router.get("/get-patients", async (req, res) => {
  try {
    const patients = await User.find({
      role: "patient",
    });
    return res.status(200).json({
      patients,
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

router.post("/get-appointments", async (req, res) => {
  const { _id, type = "patient" } = req.body;
  try {
    const appointments =
      type === "patient"
        ? await Appointment.find({ patient: _id }).populate("doctor", "name")
        : await Appointment.find({ doctor: _id }).populate("patient", "name");
    return res.status(200).json({
      appointments,
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

router.post("/get-all-appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("doctor", "name")
      .populate("patient", "name");
    return res.status(200).json({
      appointments,
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

function generateGoogleMeetLink() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let link = "https://meet.google.com/";

  // Generate three segments of the link
  for (let i = 0; i < 3; i++) {
    let segment = "";
    for (let j = 0; j < (i === 1 ? 4 : 3); j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    link += segment;

    if (i < 2) {
      // Add dashes between segments, but not at the end
      link += "-";
    }
  }

  return link;
}

router.post("/check-slot", upload.array("files", 5), async (req, res) => {
  const { doctor, date, timeSlot } = req.body;

  try {
    const savedAppointment = await Appointment.findOne({
      $and: [{ doctor: doctor }, { date: date }, { timeSlot: timeSlot }],
    });

    if (savedAppointment) {
      return res
        .status(422)
        .json({ error: "Slot is not available", status: 422 });
    } else {
      return res.status(200).json({ status: 200 });
    }
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Something Went Wrong, Please try again", status: 422 });
  }
});

router.post("/book-appointment", upload.array("files", 5), async (req, res) => {
  const { doctor, date, dob, name, problem, timeSlot, patient, testName } =
    req.body;

  const files = req.files;
  try {
    let fileLinks = files
      ? await Promise.all(files?.map((file) => uploadFileToS3(file)))
      : [];

    console.log(fileLinks);

    const appointment = new Appointment({
      doctor,
      patient,
      date,
      dob,
      name,
      problem,
      timeSlot,
      videoCallLink: generateGoogleMeetLink(),
      testName,
      files: fileLinks,
    });

    await appointment.save();

    const [user, doctorObj, patientObj] = await Promise.all([
      User.findOne({ _id: patient }).exec(),
      User.findOne({ _id: doctor, role: "doctor" }).exec(),
      User.findOne({ _id: patient, role: "patient" }).exec(),
    ]);

    const fetchedAppointment = await Appointment.findOne({
      _id: appointment._id,
    })
      .populate("doctor", "name")
      .exec();

    await mailer(
      emailMessage({
        user,
        appointment: fetchedAppointment,
        action: "bookAppointment",
      })
    );

    doctorObj.doctorAppointment.push(appointment.id);
    patientObj.patientAppointment.push(appointment.id);
    await Promise.all([doctorObj.save(), patientObj.save()]);

    res.status(200).json({
      message:
        "Congratulations, your appointment has been booked successfully!!",
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Something Went Wrong, Please try again", status: 422 });
  }
});

async function uploadFileToS3(file) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `reports/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const { Location } = await s3.upload(params).promise();
    return Location;
  } catch (err) {
    console.error("Error uploading file to S3", err);
    throw err;
  }
}

export default router;
