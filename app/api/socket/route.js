import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function GET(req, res) {
  if (!res.socket.server.io) {
    console.log("🚀 Starting Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ User connected", socket.id);

      socket.on("mobileResponse", (data) => {
        console.log("📩 Mobile says:", data);
        io.emit("message", `Mobile says: ${data}`);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  // IMPORTANT: Don't block WebSocket upgrade
  if (req.method === "GET") {
    res.status(200).json({ success: true, message: "Socket server ready" });
  } else {
    res.end();
  }
}
