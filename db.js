import mongoose from "mongoose";

const mongourl =
  "mongodb+srv://agarwalanmol29:Agarwal%4029@cluster0.ykg7fez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongourl)
  .then(function () {
    console.log("connected to db");
  })
  .catch(function (error) {
    console.log("error connecting to database" + error);
  });

import "./models/User.js";
import "./models/Query.js";
import "./models/Appointment.js";
