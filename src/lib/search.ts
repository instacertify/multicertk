import { Meilisearch } from "meilisearch";
import { buildSearchDocuments, type SearchDocument } from "@/data/catalog";

const INDEX = "certko";

let cachedDocs: SearchDocument[] | null = null;

function documents() {
  cachedDocs ??= buildSearchDocuments();
  return cachedDocs;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\u0600-\u06ff]+/gi, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

export function searchCatalog(query: string, limit = 20, type?: SearchDocument["type"]) {
  const q = query.trim();
  const docs = documents().filter((doc) => (type ? doc.type === type : true));
  if (!q) return docs.slice(0, limit);

  const tokens = tokenize(q);
  const compact = q.toLowerCase().replace(/\s+/g, "");

  const ranked = docs
    .map((doc) => {
      const haystack = `${doc.title} ${doc.subtitle} ${doc.description} ${doc.tags.join(" ")}`.toLowerCase();
      const compactHay = haystack.replace(/\s+/g, "");
      let score = 0;
      if (haystack.includes(q.toLowerCase())) score += 12;
      if (compactHay.includes(compact)) score += 8;
      for (const token of tokens) {
        if (doc.title.toLowerCase().includes(token)) score += 6;
        if (doc.subtitle.toLowerCase().includes(token)) score += 4;
        if (doc.tags.some((tag) => tag.toLowerCase().includes(token))) score += 5;
        if (haystack.includes(token)) score += 2;
      }
      return { doc, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.doc);

  return ranked;
}

function meiliClient() {
  const host = process.env.MEILI_HOST;
  if (!host) return null;
  return new Meilisearch({
    host,
    apiKey: process.env.MEILI_MASTER_KEY ?? process.env.MEILI_API_KEY,
  });
}

export async function searchAll(query: string, limit = 20, type?: SearchDocument["type"]) {
  const client = meiliClient();
  if (!client || !query.trim()) {
    return { hits: searchCatalog(query, limit, type), engine: client ? "meilisearch" : "catalog" };
  }

  try {
    const index = client.index(INDEX);
    const result = await index.search(query, {
      limit,
      filter: type ? `type = ${type}` : undefined,
    });
    return {
      hits: result.hits as SearchDocument[],
      engine: "meilisearch" as const,
    };
  } catch {
    return { hits: searchCatalog(query, limit, type), engine: "catalog" as const };
  }
}

export async function indexSearchDocuments() {
  const client = meiliClient();
  if (!client) {
    return { indexed: 0, engine: "catalog" as const };
  }

  const docs = documents();
  const index = client.index(INDEX);
  await index.updateSettings({
    searchableAttributes: ["title", "subtitle", "description", "tags"],
    filterableAttributes: ["type"],
    displayedAttributes: ["id", "type", "title", "subtitle", "description", "url", "tags"],
  });
  await index.addDocuments(docs, { primaryKey: "id" });
  return { indexed: docs.length, engine: "meilisearch" as const };
}
