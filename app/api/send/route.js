let clients = global.clients || [];
global.clients = clients;

export async function POST(req) {
  const { message } = await req.json();

  // send message to all connected desktops
  clients.forEach((writer) => {
    writer.write(`data: ${message}\n\n`);
  });

  return new Response(JSON.stringify({ success: true }));
}
