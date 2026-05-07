import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const repoRoot = path.resolve(__dirname, "..");
const PRODUCTS_KEY = "aurelien:products";

function clearStorageModules() {
  for (const modulePath of [
    path.join(repoRoot, "lib/productsJson.ts"),
    path.join(repoRoot, "lib/dataPaths.ts"),
    path.join(repoRoot, "lib/redisStorage.ts"),
  ]) {
    delete require.cache[require.resolve(modulePath)];
  }
}

async function startRedisStub() {
  const store = new Map<string, unknown>();

  const server = http.createServer((req, res) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const commands = JSON.parse(body) as unknown[][];
      const result = commands.map(([command, key, value]) => {
        const op = String(command).toLowerCase();
        const field = String(key);

        if (op === "get") {
          return { result: store.has(field) ? store.get(field) : null };
        }

        if (op === "set") {
          store.set(field, value);
          return { result: "OK" };
        }

        return { error: `Unsupported command: ${op}` };
      });

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(result));
    });
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  assert(address && typeof address === "object");

  return {
    store,
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

test("removeProductJson writes a Redis snapshot when local product JSON is read-only", async () => {
  const previousCwd = process.cwd();
  const previousRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const previousRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const previousBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const redis = await startRedisStub();
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "products-json-test-"));
  const dataDir = path.join(tempRoot, "data");
  const productsPath = path.join(dataDir, "products.json");

  try {
    await fs.mkdir(dataDir);
    await fs.writeFile(
      productsPath,
      JSON.stringify(
        [
          {
            _id: "p-admin-delete",
            name: "Admin product",
            category: "shirts",
            price: 100,
            images: ["/images/placeholder.svg"],
            size: [],
            colors: [],
          },
        ],
        null,
        2
      )
    );
    await fs.chmod(productsPath, 0o400);
    await fs.chmod(dataDir, 0o500);

    process.chdir(tempRoot);
    process.env.UPSTASH_REDIS_REST_URL = redis.url;
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    delete process.env.BLOB_READ_WRITE_TOKEN;
    clearStorageModules();

    // eslint-disable-next-line @typescript-eslint/no-require-imports -- this test reloads cwd-sensitive modules after changing process.cwd().
    const { readProductsJson, removeProductJson } = require(path.join(
      repoRoot,
      "lib/productsJson.ts"
    )) as typeof import("../lib/productsJson");

    assert.equal(await removeProductJson("p-admin-delete"), true);
    assert.deepEqual(await readProductsJson(), []);
    assert.equal(redis.store.get(PRODUCTS_KEY), "[]");
  } finally {
    process.chdir(previousCwd);
    if (previousRedisUrl === undefined) {
      delete process.env.UPSTASH_REDIS_REST_URL;
    } else {
      process.env.UPSTASH_REDIS_REST_URL = previousRedisUrl;
    }
    if (previousRedisToken === undefined) {
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    } else {
      process.env.UPSTASH_REDIS_REST_TOKEN = previousRedisToken;
    }
    if (previousBlobToken === undefined) {
      delete process.env.BLOB_READ_WRITE_TOKEN;
    } else {
      process.env.BLOB_READ_WRITE_TOKEN = previousBlobToken;
    }
    await fs.chmod(dataDir, 0o700).catch(() => {});
    await fs.chmod(productsPath, 0o600).catch(() => {});
    await fs.rm(tempRoot, { recursive: true, force: true }).catch(() => {});
    await redis.close();
    clearStorageModules();
  }
});
