if (!globalThis.sseClients) {
  globalThis.sseClients = []
}

const clients = globalThis.sseClients

export const POST = async (req) => {
  const { message } = await req.json();

  // send message to all connected desktops
  clients.forEach((res) => {
    res.write(`data: ${message}\n\n`);
  });

  return new Response(JSON.stringify({ success: true }));
};

// SSE connection handler
// Keep a list of connected clients
// Ensure we only create it once


export async function GET(req) {
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  }

  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Add client to list
  clients.push(writer)

  // Send initial message
  writer.write(encoder.encode(`data: Connected\n\n`))

  // Handle disconnect
  req.signal.addEventListener("abort", () => {
    const index = clients.indexOf(writer)
    if (index !== -1) clients.splice(index, 1)
    writer.close()
  })

  return new Response(stream.readable, { headers })
}


