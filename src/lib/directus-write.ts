import { directusUrl } from "./cms";

function token() {
  return process.env.DIRECTUS_TOKEN?.trim() || "";
}

export async function upsertDirectusItem(
  collection: string,
  filterField: string,
  filterValue: string,
  extraFilter: Record<string, string>,
  payload: Record<string, unknown>,
) {
  const base = directusUrl();
  const auth = token();
  if (!base || !auth) return { ok: false, reason: "directus-unconfigured" as const };

  const params = new URLSearchParams({
    [`filter[${filterField}][_eq]`]: filterValue,
    limit: "1",
    fields: "id",
  });
  for (const [key, value] of Object.entries(extraFilter)) {
    params.set(`filter[${key}][_eq]`, value);
  }

  const headers = {
    Authorization: `Bearer ${auth}`,
    "Content-Type": "application/json",
  };

  try {
    const found = await fetch(`${base}/items/${collection}?${params}`, { headers, cache: "no-store" });
    if (!found.ok) return { ok: false, reason: "directus-read-failed" as const };
    const json = (await found.json()) as { data?: { id: number }[] };
    const id = json.data?.[0]?.id;
    const url = id ? `${base}/items/${collection}/${id}` : `${base}/items/${collection}`;
    const response = await fetch(url, {
      method: id ? "PATCH" : "POST",
      headers,
      body: JSON.stringify(payload),
    });
    return { ok: response.ok, reason: response.ok ? ("saved" as const) : ("directus-write-failed" as const) };
  } catch {
    return { ok: false, reason: "directus-unreachable" as const };
  }
}
