/**
 * Create first admin user. Run: npm run seed:admin
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in .env.local
 */
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { createUser, findUserByEmail, updateUserRole } from "../lib/usersJson";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function seed() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
    process.exit(1);
  }
  const existing = await findUserByEmail(ADMIN_EMAIL);
  if (existing) {
    await updateUserRole(existing.id, "admin");
    console.log("Updated existing user to admin:", ADMIN_EMAIL);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await createUser({
      name: "Admin",
      email: ADMIN_EMAIL.toLowerCase(),
      password: hash,
      role: "admin",
    });
    console.log("Created admin user:", ADMIN_EMAIL);
  }
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
