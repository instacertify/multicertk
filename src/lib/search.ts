import { Meilisearch } from "meilisearch";
import { buildSearchDocuments, type SearchDocument } from "@/data/catalog";

const INDEX = "certko";
const CACHE_MS = 15_000;

let cachedDocs: { docs: SearchDocument[]; builtAt: number } | null = null;

export function invalidateSearchDocuments() {
  cachedDocs = null;
}

export function getSearchDocuments() {
  const now = Date.now();
  if (!cachedDocs || now - cachedDocs.builtAt > CACHE_MS) {
    cachedDocs = { docs: buildSearchDocuments(), builtAt: now };
  }
  return cachedDocs.docs;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\u0400-\u04ff\u0600-\u06ff\u4e00-\u9fff]+/gi, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 || /\d/.test(token));
}

export function scoreDocument(doc: SearchDocument, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const tokens = tokenize(q);
  const compact = q.replace(/\s+/g, "");
  const haystack = `${doc.title} ${doc.subtitle} ${doc.description} ${doc.tags.join(" ")}`.toLowerCase();
  const compactHay = haystack.replace(/\s+/g, "");
  const tags = doc.tags.map((tag) => tag.toLowerCase());
  let score = 0;
  if (haystack.includes(q)) score += 12;
  if (compactHay.includes(compact)) score += 8;
  if (tags.includes(q)) score += 14;
  for (const token of tokens) {
    if (doc.title.toLowerCase().includes(token)) score += 6;
    if (doc.subtitle.toLowerCase().includes(token)) score += 4;
    if (tags.some((tag) => tag === token || tag.includes(token))) score += 7;
    if (haystack.includes(token)) score += 2;
  }
  return score;
}

export function searchCatalog(query: string, limit = 20, type?: SearchDocument["type"]) {
  const docs = getSearchDocuments().filter((doc) => (type ? doc.type === type : true));
  if (!query.trim()) return docs.slice(0, limit);

  return docs
    .map((doc) => ({ doc, score: scoreDocument(doc, query) }))
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score || left.doc.title.localeCompare(right.doc.title))
    .slice(0, limit)
    .map((row) => row.doc);
}

/** Rank listing rows with the same scorer as /search and /api/search. */
export function rankByCatalogSearch<T>(
  items: T[],
  query: string | undefined,
  type: SearchDocument["type"],
  urlOf: (item: T) => string,
  limit = 5000,
): T[] {
  const q = query?.trim();
  if (!q) return items;
  const order = new Map(searchCatalog(q, limit, type).map((hit, index) => [hit.url, index]));
  return items
    .filter((item) => order.has(urlOf(item)))
    .sort((left, right) => (order.get(urlOf(left)) ?? 0) - (order.get(urlOf(right)) ?? 0));
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
  const hits = searchCatalog(query, limit, type);
  const client = meiliClient();
  if (client) {
    void indexSearchDocuments().catch(() => undefined);
  }
  return { hits, engine: "catalog" as const };
}

export async function indexSearchDocuments() {
  const client = meiliClient();
  if (!client) {
    return { indexed: getSearchDocuments().length, engine: "catalog" as const };
  }

  const docs = getSearchDocuments();
  const index = client.index(INDEX);
  await index.updateSettings({
    searchableAttributes: ["title", "subtitle", "description", "tags"],
    filterableAttributes: ["type"],
    displayedAttributes: ["id", "type", "title", "subtitle", "description", "url", "tags"],
  });
  await index.deleteAllDocuments();
  await index.addDocuments(docs, { primaryKey: "id" });
  return { indexed: docs.length, engine: "meilisearch" as const };
}
