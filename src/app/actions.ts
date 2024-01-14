"use server";

import { kv } from "@vercel/kv";

export async function loadPageContent(page: string) {
  const buffer = await kv.get<number[]>(page);

  if (!buffer) {
    return null;
  }

  return Array.from(buffer);
}

export async function savePageContent(page: string, state: Uint8Array) {
  const buffer = Array.from(state);

  await kv.set(page, buffer);
}
