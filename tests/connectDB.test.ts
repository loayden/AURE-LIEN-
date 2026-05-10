import assert from "node:assert/strict";
import test from "node:test";

import { hasConfiguredMongoUri } from "@/lib/connectDB";

function restoreEnv(key: "MONGO_URI" | "MONGODB_URI", value: string | undefined) {
  if (value == null) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}

test("hasConfiguredMongoUri is false when no Mongo env var is set", () => {
  const originalMongoUri = process.env.MONGO_URI;
  const originalMongodbUri = process.env.MONGODB_URI;

  try {
    delete process.env.MONGO_URI;
    delete process.env.MONGODB_URI;

    assert.equal(hasConfiguredMongoUri(), false);
  } finally {
    restoreEnv("MONGO_URI", originalMongoUri);
    restoreEnv("MONGODB_URI", originalMongodbUri);
  }
});

test("hasConfiguredMongoUri is true when MONGO_URI is configured", () => {
  const originalMongoUri = process.env.MONGO_URI;
  const originalMongodbUri = process.env.MONGODB_URI;

  try {
    process.env.MONGO_URI = "mongodb://example.test:27017/catalog";
    delete process.env.MONGODB_URI;

    assert.equal(hasConfiguredMongoUri(), true);
  } finally {
    restoreEnv("MONGO_URI", originalMongoUri);
    restoreEnv("MONGODB_URI", originalMongodbUri);
  }
});

test("hasConfiguredMongoUri is true when MONGODB_URI is configured", () => {
  const originalMongoUri = process.env.MONGO_URI;
  const originalMongodbUri = process.env.MONGODB_URI;

  try {
    delete process.env.MONGO_URI;
    process.env.MONGODB_URI = "mongodb+srv://example.test/catalog";

    assert.equal(hasConfiguredMongoUri(), true);
  } finally {
    restoreEnv("MONGO_URI", originalMongoUri);
    restoreEnv("MONGODB_URI", originalMongodbUri);
  }
});
