const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    path: "/api/socket",
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected", socket.id);
    socket.on("mobileResponse", (data) => {
      console.log("📩 Mobile says:", data);
      io.emit("message", `Mobile says: ${data}`);
    });
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log("🚀 Server ready on http://localhost:3001");
  });
});
