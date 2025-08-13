"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function MobilePage({ searchParams }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socketRef.current = io({ path: "/api/socket" });

      socketRef.current.on("connect", () => {
        console.log("📱 Mobile connected");
        socketRef.current.emit(
          "mobileResponse",
          `Hello from mobile at ${new Date().toLocaleTimeString()}`
        );
      });
    };
    socketInitializer();

    return () => socketRef.current?.disconnect();
  }, []);

  return (
    <div>
      <h1>Mobile Page</h1>
      <p>Message sent to desktop!</p>
    </div>
  );
}
