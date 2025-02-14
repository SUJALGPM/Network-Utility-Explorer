const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { exec } = require("child_process");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Whitelisted commands for Windows
const ALLOWED_COMMANDS = {
  IPCONFIG: "ipconfig",
  NETSTAT: "netstat",
  PING: "ping",
  NSLOOKUP: "nslookup",
  TRACEROUTE: "tracert",
  ARP: "arp -a",
  NETSH: "netsh interface ip show config",
  HOSTNAME: "hostname",
  GETMAC: "getmac",
  "ROUTE PRINT": "route print",
};


//HTTP Endpoint for Thunder Client & Frontend
app.post("/executeCommand", (req, res) => {
  const { cmd, target } = req.body;

  if (!ALLOWED_COMMANDS[cmd]) {
    return res.status(400).json({ error: `Unauthorized command: ${cmd}` });
  }

  const fullCommand = `${ALLOWED_COMMANDS[cmd]} ${target || ""}`;

  exec(fullCommand, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ output: stdout || stderr });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const { exec } = require("child_process");
// const { Server } = require("socket.io");

// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// app.use(cors());
// app.use(express.json());

// // Whitelisted commands for Windows
// const ALLOWED_COMMANDS = {
//   IPCONFIG: "ipconfig",
//   NETSTAT: "netstat",
//   PING: "ping",
//   NSLOOKUP: "nslookup",
//   TRACEROUTE: "tracert", 
// };


// // **HTTP Endpoint for Thunder Client**
// app.post("/executeCommand", (req, res) => {
//   const { cmd, target } = req.body;

//   if (!ALLOWED_COMMANDS[cmd]) {
//     return res.status(400).json({ error: `Unauthorized command: ${cmd}` });
//   }

//   const fullCommand = `start cmd /k "${ALLOWED_COMMANDS[cmd]} ${target || ""} & echo. & echo Command executed. & pause"`;

//   exec(fullCommand, (error) => {
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }
//     res.json({ message: `Command executed: ${cmd} ${target || ""}` });
//   });
// });

// const port = process.env.PORT || 3000;
// server.listen(port, () => console.log(`Server running on port ${port}`));
