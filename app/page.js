"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function DesktopPage() {
  const [messages, setMessages] = useState([]);
  const [qr, setQr] = useState("");

  useEffect(() => {
    // 1️⃣ Generate QR code pointing to mobile page
    const mobileUrl = `${window.location.origin}/mobile`;
    QRCode.toDataURL(mobileUrl).then(setQr);

    // 2️⃣ Connect SSE to receive messages
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (e) => {
      setMessages((prev) => [...prev, e.data]);
    };

    return () => eventSource.close();
  }, []);

  return (
    <div>
      <h1>Desktop Page</h1>
      <p>Scan this QR with your mobile:</p>
      {qr && <img src={qr} alt="QR code" />}
      <h2>Messages from Mobile:</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
