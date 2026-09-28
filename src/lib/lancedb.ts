import * as lancedb from "@lancedb/lancedb";

const DB_PATH = "./.lancedb";

export async function getDatabase() {
  return await lancedb.connect(DB_PATH);
}