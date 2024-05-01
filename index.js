import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import "./db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import mainRoutes from "./routes/mainRoutes.js";
import { Room } from "./room.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(authRoutes);
app.use(doctorRoutes);
app.use(patientRoutes);
app.use(mainRoutes);
app.use(paymentRoutes);
app.use(express.static("public"));

const server = http.createServer(app);

const io = new Server(server);
let port = new SerialPort({ path: "COM5", baudRate: 9600 }, (err) => {
  if (err) {
    console.error("Failed to open serial port COM5");
  } else {
    console.log("Successfully opened serial port COM5");
  }
});
let parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

app.use(express.static("public"));

const room = new Room();
io.on("connection", async (socket) => {
  console.log("A user connected to Arduino namespace");
  parser.on("data", (data) => {
    socket.emit("arduinoData", { data: data });
  });
  const roomID = await room.joinRoom();
  // join room
  socket.join(roomID);
  socket.on("send-message", (message) => {
    socket.to(roomID).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    // leave room
    room.leaveRoom(roomID);
  });
});

server.on("error", (err) => {
  console.log("Error opening server");
});

server.listen(5050, () => {
  console.log("Server working on port 5050");
});