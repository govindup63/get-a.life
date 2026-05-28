import { db } from "./mongo";

// Cheap total — uses collection metadata, no scan. Returns null if mongo is unreachable
// so the caller can hide the counter instead of rendering a broken zero.
export async function totalRoasts(): Promise<number | null> {
  const d = await db();
  if (!d) return null;
  try {
    return await d.collection("visits").estimatedDocumentCount();
  } catch {
    return null;
  }
}
