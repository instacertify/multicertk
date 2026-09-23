/**
 * Create the three Certko collections in Directus and seed headings/articles.
 *   docker compose up -d
 *   npm run cms:bootstrap
 */
import { seedArticles, seedPages } from "../src/data/cms-seed";

const base = (process.env.DIRECTUS_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const email = process.env.DIRECTUS_ADMIN_EMAIL || "admin@certko.com";
const password = process.env.DIRECTUS_ADMIN_PASSWORD || "certko-admin";

async function login() {
  const response = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(`Directus login failed (${response.status}). Is it running at ${base}?`);
  }
  const json = (await response.json()) as { data: { access_token: string } };
  return json.data.access_token;
}

async function api(token: string, method: string, path: string, body?: unknown) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok && response.status !== 409) {
    const text = await response.text();
    throw new Error(`${method} ${path} → ${response.status} ${text.slice(0, 400)}`);
  }
  return response.status === 204 ? null : response.json();
}

async function ensureCollection(
  token: string,
  collection: string,
  note: string,
  icon: string,
  fields: { field: string; type: string; interface?: string; required?: boolean }[],
) {
  await api(token, "POST", "/collections", {
    collection,
    meta: { icon, note, display_template: "{{title}}" },
    schema: {},
  }).catch(() => null);

  for (const field of fields) {
    await api(token, "POST", `/fields/${collection}`, {
      field: field.field,
      type: field.type,
      meta: {
        interface: field.interface ?? (field.type === "text" ? "input-multiline" : "input"),
        required: Boolean(field.required),
      },
      schema: {},
    }).catch(() => null);
  }
}

async function main() {
  const token = await login();
  console.log("Logged in to Directus");

  await ensureCollection(token, "cms_pages", "Page titles and intros", "web", [
    { field: "slug", type: "string", required: true },
    { field: "locale", type: "string", required: true },
    { field: "path", type: "string" },
    { field: "title", type: "string", required: true },
    { field: "intro", type: "text" },
  ]);

  await ensureCollection(token, "cms_sections", "Section headings and articles", "title", [
    { field: "page_slug", type: "string", required: true },
    { field: "locale", type: "string", required: true },
    { field: "key", type: "string", required: true },
    { field: "heading", type: "string", required: true },
    { field: "body", type: "text" },
    { field: "sort", type: "integer" },
  ]);

  await ensureCollection(token, "cms_articles", "Blog articles", "article", [
    { field: "slug", type: "string", required: true },
    { field: "locale", type: "string", required: true },
    { field: "title", type: "string", required: true },
    { field: "heading", type: "string" },
    { field: "excerpt", type: "text" },
    { field: "body", type: "text" },
    { field: "date", type: "string" },
    { field: "tags", type: "string" },
    { field: "related_product_slugs", type: "string" },
    { field: "related_scheme_slugs", type: "string" },
    { field: "status", type: "string" },
  ]);

  for (const page of seedPages) {
    await api(token, "POST", "/items/cms_pages", {
      slug: page.slug,
      locale: page.locale,
      path: page.path,
      title: page.title,
      intro: page.intro,
    }).catch(() => null);
    for (const [index, section] of page.sections.entries()) {
      await api(token, "POST", "/items/cms_sections", {
        page_slug: page.slug,
        locale: page.locale,
        key: section.key,
        heading: section.heading,
        body: section.body.join("\n\n"),
        sort: index + 1,
      }).catch(() => null);
    }
  }

  for (const article of seedArticles) {
    await api(token, "POST", "/items/cms_articles", {
      slug: article.slug,
      locale: article.locale,
      title: article.title,
      heading: article.heading,
      excerpt: article.excerpt,
      body: article.body.join("\n\n"),
      date: article.date,
      tags: article.tags.join(", "),
      related_product_slugs: article.relatedProductSlugs.join(", "),
      related_scheme_slugs: article.relatedSchemeSlugs.join(", "),
      status: article.status,
    }).catch(() => null);
  }

  console.log("Collections ready: cms_pages, cms_sections, cms_articles");
  console.log("Studio:", `${base}/admin`);
  console.log("Set DIRECTUS_TOKEN to a static token from Settings → Access Tokens, then restart Next.js.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
