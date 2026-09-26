const { spawn } = require("child_process");

const server = spawn("node", ["mcp/bout-store/server.js"], {
  env: { ...process.env, BOUT_BASE_URL: "http://localhost:3127" },
  stdio: ["pipe", "pipe", "inherit"],
});

let out = "";
let calls = 0;
server.stdout.on("data", (d) => {
  out += d.toString();
  for (const line of out.split("\n").filter(Boolean)) {
    try {
      const msg = JSON.parse(line);
      if (msg.id === 3 && msg.result) {
        console.log("health:", msg.result.content[0].text.slice(0, 160).replace(/\n/g, " "));
        server.stdin.write(
          JSON.stringify({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "bout_list_products", arguments: { query: "jacket", limit: 2 } } }) + "\n"
        );
      }
      if (msg.id === 4) {
        calls++;
        if (msg.result) console.log("products:", msg.result.content[0].text.slice(0, 200).replace(/\n/g, " "));
        else console.log("products error:", JSON.stringify(msg.error).slice(0, 160));
        server.kill();
        process.exit(0);
      }
    } catch { /* partial */ }
  }
});

(async () => {
  server.stdin.write(
    JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "0" } } }) + "\n"
  );
  await new Promise((r) => setTimeout(r, 400));
  server.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
  await new Promise((r) => setTimeout(r, 400));
  server.stdin.write(
    JSON.stringify({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "bout_store_health", arguments: {} } }) + "\n"
  );
  setTimeout(() => {
    console.log("timed out");
    server.kill();
    process.exit(1);
  }, 20000);
})();
