import { getDatabase } from "./lancedb";
import { generateEmbedding } from "./embeddings";
import { chunkText } from "./chunkText";

const TABLE_NAME = "documents";

export async function storeDocument(
  text: string,
  fileName: string
) {
  const db = await getDatabase();

  const chunks = chunkText(text);

  const rows = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const embedding = await generateEmbedding(chunk);

    rows.push({
      id: `${fileName}-${i}`,
      text: chunk,
      fileName,
      chunkIndex: i,
      vector: embedding,
    });
  }

  if (rows.length === 0) {
    throw new Error("No text chunks were created from the document.");
  }

  const tableNames = await db.tableNames();

  if (tableNames.includes(TABLE_NAME)) {
    const table = await db.openTable(TABLE_NAME);
    await table.add(rows);

    return {
      chunks: rows.length,
      fileName,
    };
  }

  await db.createTable(TABLE_NAME, rows);

  return {
    chunks: rows.length,
    fileName,
  };
}

export async function searchDocuments(
  query: string,
  limit = 5
) {
  const db = await getDatabase();

  const tableNames = await db.tableNames();

  if (!tableNames.includes(TABLE_NAME)) {
    return [];
  }

  const table = await db.openTable(TABLE_NAME);

  const queryEmbedding = await generateEmbedding(query);

  const results = await table
    .vectorSearch(queryEmbedding)
    .limit(limit)
    .toArray();

  return results;
}