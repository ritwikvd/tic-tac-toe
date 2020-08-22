const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const handleConnection = require("./socket/handleSocketConnection");

//Configure path to env variables
dotenv.config({ path: "./config/config.env" });

//Initialize middleware
app.use(cors());
app.use(express.json());
//

//Use React build
app.use(express.static("./client/build"));

app.get("*", (_, res) => res.sendFile(path.resolve("./client/build/index.html")));
//

//Socket emitters and handlers
io.on("connection", socket => handleConnection(socket, io));

const PORT = process.env.PORT || 8080;

server.listen(PORT, console.log(`yoohoo from ${process.env.NODE_ENV} on port:${PORT}`));
