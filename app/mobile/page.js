"use client";

import { useEffect } from "react";

export default function MobilePage() {
  useEffect(() => {
    // Send message to server on load
    fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello from Mobile!" }),
    });
  }, []);

  return (
    <div>
      <h1>Mobile Page</h1>
      <p>Message sent to desktop!</p>
    </div>
  );
}
