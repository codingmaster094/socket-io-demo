"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import QRCode from "qrcode";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [qr, setQr] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    // 1️⃣ Connect to socket
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socketRef.current = io({ path: "/api/socket" });

      socketRef.current.on("connect", () => console.log("✅ Connected"));
      socketRef.current.on("message", (msg) =>
        setMessages((prev) => [...prev, msg])
      );
    };
    socketInitializer();

    // 2️⃣ Generate QR Code that links to mobile page
    const mobileUrl = `${window.location.origin}/mobile?room=main`;
    QRCode.toDataURL(mobileUrl).then(setQr);

    return () => socketRef.current?.disconnect();
  }, []);

  return (
    <div>
      <h1>Desktop Page</h1>
      <p>Scan this QR code with your mobile:</p>
      {qr && <img src={qr} alt="Scan to open mobile page" />}

      <h2>Messages from Mobile:</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
