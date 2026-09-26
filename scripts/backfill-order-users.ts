import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
  const orders = await prisma.order.findMany({
    select: { userId: true, customerName: true },
  });
  const userIds = [...new Set(orders.map((order) => order.userId).filter(Boolean))];
  const existingUsers = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true } })
    : [];
  const existingIds = new Set(existingUsers.map((user) => user.id));
  const customersById = new Map(orders.map((order) => [order.userId, order.customerName]));
  const missingIds = userIds.filter((userId) => !existingIds.has(userId));

  for (const userId of missingIds) {
    const email = `guest-${userId}@guest.bout.invalid`;
    await prisma.user.upsert({
      where: { email },
      create: {
        id: userId,
        email,
        name: customersById.get(userId)?.trim() || "Guest customer",
        password: await hashPassword(randomUUID()),
        role: "guest",
        accountIntent: "buyer",
        authProvider: "guest",
      },
      update: {},
    });
  }

  console.log(JSON.stringify({ orders: orders.length, backfilledUsers: missingIds.length }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
