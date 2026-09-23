# Certko

Certification and compliance catalogue for **certko.com** — rebuilt on Next.js so every lab standard and certification scheme is searchable and interlinked.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS |
| Routing / i18n | next-intl (`en`, `hi`, `zh`, `es`, `fr`, `ar`, `ru`) — English unprefixed to match the public sitemap |
| Validation | Zod |
| Database | PostgreSQL + Drizzle ORM (optional; catalogue ships as generated JSON) |
| CMS | Directus — page headings, section copy and blog articles (`/admin/content`) |
| Search | Meilisearch Community Edition, with an in-process catalogue fallback |
| Translation | AI translation API + human review queue at `/admin/translations` |
| SEO | Metadata API, `sitemap.xml`, hreflang alternates, Schema.org JSON-LD |
| Web server | Nginx |
| Process manager | PM2 |

URL shape follows [https://certko.com/sitemap.xml](https://certko.com/sitemap.xml): `/product/*`, `/certifications/*`, `/testing/*`, `/labs/*`, `/category/*`, `/qco`, and the supporting pages.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Search works immediately against the interlinked TypeScript catalogue (no Postgres or Meilisearch required).

### Optional infrastructure

```bash
docker compose up -d
cp .env.example .env
npm run cms:bootstrap
```

Directus Studio is at [http://localhost:8055](http://localhost:8055) (`admin@certko.com` / `certko-admin`). Create a static token and set `DIRECTUS_TOKEN`. Until Directus is running, `/admin/content` still edits headings and articles on the site.

The product catalogue stays in `src/data/generated/library.json` — do not put 1,700 IS records into Directus.

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run search:index
```

Set `OPENAI_API_KEY` to send real drafts through the translation API. Without a key the review queue still works and stores placeholder drafts for human edit / approve / reject.

## Production

1. `npm run build`
2. `pm2 start ecosystem.config.cjs`
3. Point Nginx at `deploy/nginx/certko.conf`

## Catalogue model

Products, schemes, countries, labs, tests, QCOs and posts form a graph:

- A **product** points at schemes, labs, tests, a category, an HSN and a QCO.
- A **lab** points at the IS standards it can unlock.
- A **test** points back at products and labs.
- A **country** points at the schemes that usually apply there.

Search indexes every node. Related-product scoring uses shared schemes, labs, tests and QCOs.

The live catalogue is generated from the BIS / BEE / G-Mark / EU Excel library:

```bash
npm run library:build
```

That writes `src/data/generated/library.json` — unique pages for every mapped product, recognised lab, BEE appliance, G-Mark category, EU sector and QCO. Each English URL is also served in Chinese, Spanish, French, Arabic and Russian (`/zh`, `/es`, `/fr`, `/ar`, `/ru`). Hindi remains available at `/hi`.
