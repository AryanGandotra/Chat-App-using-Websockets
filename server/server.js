import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "../client")));

const HTTP = http.Server(app);
const PORT = 3000;

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const io = new Server(HTTP);

io.on("connection", (socket) => {
  console.log("Device connected with id: ", socket.id);

  socket.on("disconnect", () => {
    console.log("Device disconnected with id: ", socket.id);
  });

  socket.on("send-message", (message, room) => {
    if (room === "") {
      socket.broadcast.emit("receive-message", message);
    } else {
      socket.to(room).emit("receive-message", message);
    }
  });

  socket.on("join-room", (room,cb) => {
    socket.join(room);
    cb(`Joined Room ${room}`)
  });
});

HTTP.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
