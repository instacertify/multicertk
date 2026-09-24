/**
 * Drop Certko Excel workbooks into data/library/ then run:
 *   npx tsx scripts/import-library.ts
 *
 * Expected filenames (any subset):
 *   BEE_Star_Label_Master_Single_Sheet_2026.xlsx
 *   BIS_Labs_Category_Scope_Wise.xlsx
 *   BIS_Labs_Merged_Scope_Wise.xlsx
 *   BIS_LIMS_200K_Full_Scale_Directory.xlsx
 *   BIS_Master_HSN_Category_QCO_Status*.xlsx
 *   GMark_Product_Categories_Standards_IECEE_GSO.xlsx
 *   EU_Sector_Testing_and_Notified_Body_Matrix.xlsx
 *   CERTKO_Scope_Template.xlsx
 *   certko-products-template.xlsx
 *
 * The importer writes a JSON snapshot that the catalogue search index can merge
 * so every library row becomes a unique, interlinked page.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const libraryDir = path.join(process.cwd(), "data", "library");

async function main() {
  await mkdir(libraryDir, { recursive: true });
  const files = (await readdir(libraryDir)).filter((name) => name.endsWith(".xlsx"));

  if (files.length === 0) {
    console.log(
      "No .xlsx files in data/library/. Add the BIS / BEE / G-Mark / EU workbooks and re-run.",
    );
    return;
  }

  let xlsx: typeof import("xlsx");
  try {
    xlsx = await import("xlsx");
  } catch {
    console.error("Install SheetJS first: npm install xlsx");
    process.exit(1);
  }

  const snapshot: Record<string, { sheets: Record<string, unknown[]> }> = {};

  for (const file of files) {
    const workbook = xlsx.readFile(path.join(libraryDir, file));
    snapshot[file] = { sheets: {} };
    for (const sheetName of workbook.SheetNames) {
      snapshot[file].sheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "",
      });
    }
    console.log(`Read ${file} (${workbook.SheetNames.length} sheets)`);
  }

  const out = path.join(process.cwd(), "data", "library-snapshot.json");
  await writeFile(out, JSON.stringify(snapshot));
  console.log(`Wrote ${out}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
