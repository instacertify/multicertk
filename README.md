# Certko

Certification and compliance catalogue for **certko.com** — rebuilt on Next.js so every lab standard and certification scheme is searchable and interlinked.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS |
| Routing / i18n | next-intl (`en`, `hi`, `ar`) — English unprefixed to match the public sitemap |
| Validation | Zod |
| Database | PostgreSQL + Drizzle ORM |
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
