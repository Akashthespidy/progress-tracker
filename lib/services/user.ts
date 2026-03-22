import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  // Check if user exists in our DB
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  // Create new user — handle race condition with ON CONFLICT
  try {
    const newUser = await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress ?? "User",
        imageUrl: clerkUser.imageUrl,
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
          name: clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
            : clerkUser.emailAddresses[0]?.emailAddress ?? "User",
          imageUrl: clerkUser.imageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();

    return newUser[0];
  } catch {
    // If insert still fails, fetch the existing record
    const fallback = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (fallback.length > 0) return fallback[0];
    throw new Error("Failed to create or retrieve user");
  }
}

export async function getUserByClerkId(clerkId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return result[0] ?? null;
}
