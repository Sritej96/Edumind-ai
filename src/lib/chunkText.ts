export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 200
): string[] {
  const cleanedText = text
    .replace(/\s+/g, " ")
    .trim();

  const chunks: string[] = [];

  let start = 0;

  while (start < cleanedText.length) {
    const end = Math.min(start + chunkSize, cleanedText.length);

    const chunk = cleanedText.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    if (end >= cleanedText.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}