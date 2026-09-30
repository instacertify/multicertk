import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { categories as categoryRows, countries as countryRows, labs as labRows, products as productRows, schemes as schemeRows, tests as testRows } from "../data/catalog";
import { categories, countries, labs, products, schemes, tests } from "./schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("DATABASE_URL not set — catalogue still ships as TypeScript modules.");
    return;
  }

  const client = postgres(url, { max: 1 });
  const db = drizzle(client);

  await db.insert(schemes).values(
    schemeRows.map((row) => ({
      slug: row.slug,
      name: row.name,
      shortName: row.shortName,
      regulator: row.regulator,
      family: row.family,
      summary: row.summary,
      countrySlugs: row.countrySlugs,
    })),
  ).onConflictDoNothing();

  await db.insert(countries).values(
    countryRows.map((row) => ({
      slug: row.slug,
      name: row.name,
      region: row.region,
      summary: row.summary,
      schemeSlugs: row.schemeSlugs,
    })),
  ).onConflictDoNothing();

  await db.insert(categories).values(
    categoryRows.map((row) => ({
      slug: row.slug,
      name: row.name,
      summary: row.summary,
    })),
  ).onConflictDoNothing();

  await db.insert(products).values(
    productRows.map((row) => ({
      slug: row.slug,
      name: row.name,
      standard: row.standard,
      hsn: row.hsn,
      categorySlug: row.categorySlug,
      qcoStatus: row.qcoStatus,
      qcoSlug: row.qcoSlug,
      testCostMin: row.testCostMin,
      testCostMax: row.testCostMax,
      excerpt: row.excerpt,
      schemeSlugs: row.schemeSlugs,
      labSlugs: row.labSlugs,
      testSlugs: row.testSlugs,
      countrySlugs: row.countrySlugs,
    })),
  ).onConflictDoNothing();

  await db.insert(labs).values(
    labRows.map((row) => ({
      slug: row.slug,
      name: row.name,
      city: row.city,
      state: row.state,
      bisCode: row.bisCode,
      standardCodes: row.standardCodes,
    })),
  ).onConflictDoNothing();

  await db.insert(tests).values(
    testRows.map((row) => ({
      slug: row.slug,
      discipline: row.discipline,
      name: row.name,
      standard: row.standard,
      summary: row.summary,
      productSlugs: row.productSlugs,
      labSlugs: row.labSlugs,
    })),
  ).onConflictDoNothing();

  await client.end();
  console.log("Seeded PostgreSQL from the interlinked catalogue.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
