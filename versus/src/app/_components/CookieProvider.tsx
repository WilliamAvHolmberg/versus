"use server";

import { cookies } from "next/headers";
import { HomePage } from "./HomePage";

export async function CookieProvider() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  return (
    <HomePage initialUserId={userId} />
  );
} 