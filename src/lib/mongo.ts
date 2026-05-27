import { MongoClient, type Db } from "mongodb";

const DB_NAME = "get-some";
const uri = process.env.MONGODB_URI;

// Cache the client across hot-reloaded module instances and lambda invocations.
// Without this, every request in dev creates a new connection.
declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var __mongoIndexesEnsured: boolean | undefined;
}

function client(): Promise<MongoClient> | null {
  if (!uri) return null;
  if (!global.__mongoClient) {
    global.__mongoClient = new MongoClient(uri, {
      // Conservative timeouts so a Mongo outage never hangs a page render.
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    }).connect();
  }
  return global.__mongoClient;
}

export async function db(): Promise<Db | null> {
  const c = await client()?.catch(() => null);
  if (!c) return null;
  const d = c.db(DB_NAME);
  if (!global.__mongoIndexesEnsured) {
    global.__mongoIndexesEnsured = true;
    // Fire-and-forget; indexes are idempotent.
    void Promise.all([
      d.collection("visits").createIndex({ ts: -1 }),
      d.collection("visits").createIndex({ subdomain: 1, ts: -1 }),
      d.collection("subdomains").createIndex({ visits: -1 }),
    ]).catch(() => {});
  }
  return d;
}

export const MONGO_ENABLED = Boolean(uri);
