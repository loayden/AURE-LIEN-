const { spawn } = require("child_process");

const server = spawn("node", ["mcp/bout-store/server.js"], {
  env: { ...process.env, BOUT_BASE_URL: "http://localhost:3127" },
  stdio: ["pipe", "pipe", "inherit"],
});

const messages = [
  { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "0" } } },
  { jsonrpc: "2.0", method: "notifications/initialized" },
  { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
];

let out = "";
server.stdout.on("data", (d) => {
  out += d.toString();
  const lines = out.split("\n").filter(Boolean);
  for (const line of lines) {
    try {
      const msg = JSON.parse(line);
      if (msg.id === 2 && msg.result) {
        console.log("tools:", msg.result.tools.map((t) => t.name).join(", "));
        server.kill();
        process.exit(0);
      }
    } catch { /* partial line */ }
  }
});

(async () => {
  for (const m of messages) {
    server.stdin.write(JSON.stringify(m) + "\n");
    await new Promise((r) => setTimeout(r, 400));
  }
  setTimeout(() => {
    console.log("no tools/list response");
    server.kill();
    process.exit(1);
  }, 8000);
})();
