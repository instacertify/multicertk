import { writeFileSync } from "node:fs";
import library from "../src/data/generated/library.json" with { type: "json" };

const products = library.products.filter((item) => item.schemeLabel === "CRS Registration");
if (products.length !== 76) {
  console.warn("CRS product count is", products.length);
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function range(product) {
  if (!product.testCostMax || product.testCostMin === product.testCostMax) return money(product.testCostMax || product.testCostMin);
  return `${money(product.testCostMin)}–${money(product.testCostMax)}`;
}

function wireless(product) {
  return /wireless|wifi|bluetooth|mobile|laptop|notebook|tablet|webcam|camera|microphone|router|hotspot|keyboard/i.test(
    `${product.name} ${product.slug}`,
  );
}

function para(id, text) {
  return { id, type: "paragraph", text };
}

function table(id, caption, rows) {
  return { id, type: "table", caption, rows };
}

function bar(id, label, value) {
  return { id, type: "bar", label, value };
}

function spacer(id) {
  return { id, type: "spacer", size: "md" };
}

function article({ slug, title, excerpt, product, date, tags, blocks }) {
  const body = blocks.filter((block) => block.type === "paragraph").map((block) => block.text);
  return {
    slug,
    locale: "en",
    title,
    heading: title,
    excerpt,
    body,
    blocks,
    date,
    tags,
    relatedProductSlugs: [product.slug],
    relatedSchemeSlugs: ["bis"],
    status: "published",
  };
}

function radioNote(product) {
  return wireless(product)
    ? ` If the ${product.name} SKU carries Wi-Fi, Bluetooth or a cellular radio, stack a WPC ETA / equipment type approval on the same project — CRS never replaces the radio licence.`
    : "";
}

const builders = {
  manufacture(product) {
    const title = `CRS licence to manufacture ${product.name} in India`;
    return article({
      product,
      title,
      excerpt: `What licence and certification a factory needs before it can manufacture ${product.name} (${product.standard}) for sale in India.`,
      tags: ["CRS", "Manufacture", "BIS", product.category],
      slug: `crs-manufacture-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `${product.name} sits on the BIS Compulsory Registration Scheme (CRS / Scheme II) against ${product.standard}. HSN ${product.hsn}. ${product.qcoLabel}. This is a lab-test registration of the brand and model — not a Scheme I ISI factory licence — and you still need it if the finished goods are made in India.`,
        ),
        para(
          "p2",
          `To manufacture ${product.name} in India you typically hold GST, a factory or Udyam record, and then file CRS on the BIS portal with the ${product.standard} test report from a recognised lab. You do not wait for a factory inspection the way ISI Scheme I works. The registration number and the BIS Standard Mark go on the product, packaging or rating plate before you stock or sell.`,
        ),
        table("t1", "Manufacturer path for this SKU", [
          ["Item", "What BIS looks at"],
          ["Product", product.name],
          ["Indian Standard", product.standard],
          ["HSN", product.hsn],
          ["Scheme", "CRS (Scheme II) registration"],
          ["Factory inspection", "Not required for CRS"],
          ["Typical lab window", product.timeline],
        ]),
        para(
          "p3",
          `Listed laboratory charges for ${product.standard} run ${range(product)} excluding GST. Keep the BOM, enclosure, PSU and critical insulation identical to the tested sample — a board spin or adapter swap is a new model and a new CRS line.${radioNote(product)}`,
        ),
        bar("b1", "Lab evidence share of a first filing", 55),
        spacer("s1"),
        para(
          "p4",
          `If the listed test price looks expensive, contact Certko — we regularly secure up to 30% lesser pricing on ${product.name} CRS testing and handle the portal filing so the factory can keep building.`,
        ),
      ],
    });
  },
  china(product) {
    const title = `Importing ${product.name} from China: CRS registration`;
    return article({
      product,
      title,
      excerpt: `A finished ${product.name} made in China cannot be sold in India on a CCC mark. Map ${product.standard} CRS before the shipment leaves.`,
      tags: ["CRS", "China", "Import", "BIS", product.category],
      slug: `crs-import-china-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `Chinese factories often already hold CCC, SRRC or a CB report for ${product.name}. None of those marks let you sell the goods in India. For HSN ${product.hsn} the Indian gate is BIS CRS against ${product.standard}. ${product.qcoLabel}.`,
        ),
        para(
          "p2",
          `The Chinese manufacturer can own the CRS registration and appoint an Authorised Indian Representative (AIR), or the Indian importer can register the brand it places on the market. Customs officers check the CRS number on ${product.name} consignments — a missing number is a hold, not a “pay later” option.`,
        ),
        table("t1", "China → India checklist", [
          ["Step", "Owner"],
          [`Confirm HSN and ${product.standard} scope`, "Importer / Certko"],
          ["Book a BIS-recognised lab", "AIR or Indian applicant"],
          ["Ship samples of the exact China-built construction", "Factory"],
          ["Upload report on the CRS portal", "Applicant"],
          ["Mark cartons with the registration number", "Factory / 3PL"],
        ]),
        para(
          "p3",
          `Plan ${product.timeline} for testing plus portal queries. Listed charges ${range(product)}. Do not assume a Shenzhen CB report converts automatically — Indian national differences and the current ${product.standard} edition still have to match.${radioNote(product)}`,
        ),
        bar("b1", "Shipments that clear without a CRS number", 0),
        spacer("s1"),
        para(
          "p4",
          `Certko maps the China construction to ${product.standard}, books the lab, and files CRS so the first container is not the test sample.`,
        ),
      ],
    });
  },
  vietnam(product) {
    const title = `Importing ${product.name} from Vietnam: CRS registration`;
    return article({
      product,
      title,
      excerpt: `Vietnam-built ${product.name} still needs Indian CRS on ${product.standard} before it can be sold here — CR or ASEAN marks are not enough.`,
      tags: ["CRS", "Vietnam", "Import", "BIS", product.category],
      slug: `crs-import-vietnam-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `A growing share of ${product.name} now ships from Vietnam instead of China. MIC / CR marks and an ASEAN CB route help other markets. They do not replace BIS CRS for India. The standard remains ${product.standard}, HSN ${product.hsn}. ${product.qcoLabel}.`,
        ),
        para(
          "p2",
          `Treat the Vietnamese plant as a foreign manufacturer: appoint an AIR if the brand owner sits outside India, test the Vietnam-built sample (not a leftover China unit), and register that construction. A China CRS line does not cover a Vietnam second source unless the BOM and layout are proven identical and BIS accepts the series.`,
        ),
        table("t1", "Vietnam origin notes", [
          ["Topic", "Practice"],
          ["Standard", product.standard],
          ["HSN", product.hsn],
          ["Origin mark", "Vietnam / Made in Vietnam on the rating label"],
          ["Second source", "New model or series request if the PCB differs"],
          ["Lab window", product.timeline],
        ]),
        para(
          "p3",
          `Listed testing for this SKU is ${range(product)}. If you dual-source China and Vietnam, budget two sample sets and say so on the portal — mixed constructions are the usual query that stalls ${product.name} registrations.${radioNote(product)}`,
        ),
        bar("b1", "Need for a Vietnam-built test sample", 100),
        spacer("s1"),
        para(
          "p4",
          `Certko files the Vietnam plant as its own manufacturing location on CRS and keeps the China line separate so neither factory blocks the other.`,
        ),
      ],
    });
  },
  assemble(product) {
    const title = `Assemble ${product.name} in India from China or Vietnam parts — CRS is the route`;
    return article({
      product,
      title,
      excerpt: `Importing spare parts or CKD/SKD kits and assembling ${product.name} in India does not dodge BIS. You can always take the CRS route on the finished unit.`,
      tags: ["CRS", "Assembly", "CKD", "Spare parts", "BIS", product.category],
      slug: `crs-assemble-india-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `If you import spare parts, SKD or CKD kits of ${product.name} from China or Vietnam and want to assemble in India, you can always go for the CRS route. BIS looks at the finished product you place on the Indian market — ${product.name} under ${product.standard} — not at each screw and bare PCB in the inbound carton.`,
        ),
        para(
          "p2",
          `Unpopulated housings, displays, batteries shipped as parts, or a CKD kit billed as components usually stay outside CRS at the border. The moment your Indian line assembles a complete, usable ${product.name} (HSN ${product.hsn} as a finished good), CRS registration is what lets you manufacture and sell it. That is often cleaner than importing a CBU and fighting a finished-goods hold.`,
        ),
        table("t1", `Parts versus finished ${product.name}`, [
          ["What you bring in", "Typical treatment"],
          ["Spare modules / bare boards", "Usually not CRS at import"],
          ["CKD / SKD kit", "Parts in; CRS on the assembled unit"],
          [`CBU finished ${product.name}`, "CRS needed before sale / often before clearance"],
          ["Indian-assembled finished unit", "Register as an Indian manufacturer on CRS"],
        ]),
        para(
          "p3",
          `Register the Indian assembly site as the manufacturer. Test the unit that actually comes off the Indian line — not a golden sample from Shenzhen — against ${product.standard}. Lab window ${product.timeline}, listed charges ${range(product)}. Keep a parts-trace file so a Vietnam substitute cell or adapter does not silently break the registered construction.${radioNote(product)}`,
        ),
        bar("b1", "Finished assembled units that need CRS", 100),
        spacer("s1"),
        para(
          "p4",
          `This is the route Certko recommends when a brand wants Indian value-add: import parts, assemble here, test the Indian build, file CRS. One registration covers the manufactured goods. Contact Certko if you want the parts list and the finished-goods HSN scoped before the first kit lands.`,
        ),
      ],
    });
  },
  howto(product) {
    const title = `How to apply for BIS CRS on ${product.name}`;
    return article({
      product,
      title,
      excerpt: `Step-by-step CRS filing for ${product.name}: portal, samples, ${product.standard} report and marking.`,
      tags: ["CRS", "How to", "BIS", product.category],
      slug: `crs-how-to-apply-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `CRS for ${product.name} is a portal filing backed by a ${product.standard} test report. ${product.qcoLabel}. HSN ${product.hsn}. You do not book a BIS factory audit for this scheme.`,
        ),
        para(
          "p2",
          `Create the BIS CRS login, add the brand and manufacturing address (Indian plant or foreign plant plus AIR), list every model that shares the construction, and upload labels, user manual and a critical-component list. Then send samples to a lab whose scope includes ${product.standard}.`,
        ),
        table("t1", "Application sequence", [
          ["Order", "Action"],
          ["1", `Scope the exact ${product.name} models`],
          ["2", `Book ${product.standard} at a recognised lab`],
          ["3", "Upload the report and labels on the CRS portal"],
          ["4", "Answer queries; receive the registration number"],
          ["5", "Mark production and keep the series file"],
        ]),
        para(
          "p3",
          `Expect ${product.timeline} once samples are in the lab, plus query time. Listed test charges ${range(product)}. Do not print the Standard Mark until the number is issued.${radioNote(product)}`,
        ),
        bar("b1", "Filings that stall on label or BOM mismatches", 40),
        spacer("s1"),
        para(
          "p4",
          `Certko prepares the model list, books the lab and answers portal queries for ${product.name} so the operations team only ships samples and applies the mark.`,
        ),
      ],
    });
  },
  testing(product) {
    const title = `Lab testing and samples for ${product.name} CRS`;
    return article({
      product,
      title,
      excerpt: `What a BIS-recognised lab will ask for when ${product.name} is tested to ${product.standard}.`,
      tags: ["CRS", "Testing", "Labs", "BIS", product.category],
      slug: `crs-testing-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `CRS evidence for ${product.name} is a complete ${product.standard} report from a BIS-recognised laboratory. Partial CE or FCC packets are useful background; they are not the CRS report. HSN ${product.hsn}.`,
        ),
        para(
          "p2",
          `Send the production-intent construction: the same enclosure, PSU, battery, display and insulation you will ship. Labs reject “engineering” boards that do not match the label drawing. Ask for a sample plan up front — ${product.name} often needs more than one unit if destructive clauses apply.`,
        ),
        table("t1", "Indicative test envelope", [
          ["Item", "Value"],
          ["Standard", product.standard],
          ["Listed charges", range(product)],
          ["Turnaround", product.timeline],
          ["Unit on the quote", product.unit || "1 set"],
        ]),
        para(
          "p3",
          `If the listed range looks wide, it is because clause packs and series testing differ. Contact Certko for a scoped quote — we regularly secure up to 30% lesser pricing than the listed laboratory charges for ${product.name}.${radioNote(product)}`,
        ),
        bar("b1", "Reports accepted without the current IS edition", 5),
        spacer("s1"),
        para(
          "p4",
          `After the report, keep the sample seal photos and the critical-component list with the CRS file. A surveillance or series addition will ask for them.`,
        ),
      ],
    });
  },
  air(product) {
    const title = `Foreign factory and AIR duties for ${product.name}`;
    return article({
      product,
      title,
      excerpt: `How a China or Vietnam plant registers ${product.name} on CRS through an Authorised Indian Representative.`,
      tags: ["CRS", "AIR", "Foreign manufacturer", "BIS", product.category],
      slug: `crs-air-foreign-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `A factory outside India that manufactures ${product.name} to ${product.standard} cannot hold CRS without an Authorised Indian Representative. The AIR is the Indian legal face for notices, sample calls and surveillance on HSN ${product.hsn} goods.`,
        ),
        para(
          "p2",
          `Name the actual manufacturing address in China, Vietnam or elsewhere. A trading office is not a factory. If you later assemble the same ${product.name} in India, add the Indian site as its own manufacturer — do not hide a second plant behind the AIR.`,
        ),
        table("t1", "Who signs what", [
          ["Role", "Duty"],
          ["Foreign manufacturer", "Owns construction and test samples"],
          ["AIR", "Indian service address, portal, queries"],
          ["Importer", "May be the AIR or a separate buyer"],
          ["Indian assembler", "Can register as manufacturer on the finished unit"],
        ]),
        para(
          "p3",
          `Lab window ${product.timeline}, listed charges ${range(product)}. AIR agreements should say who pays retests and who holds the brand.${radioNote(product)}`,
        ),
        bar("b1", "Foreign plants that still need an AIR", 100),
        spacer("s1"),
        para(
          "p4",
          `Certko can act as the compliance desk beside your AIR: scope ${product.name}, book ${product.standard}, and keep the foreign and Indian plants on separate CRS lines.`,
        ),
      ],
    });
  },
  ckd(product) {
    const title = `CKD, SKD or CBU for ${product.name} — CRS still applies`;
    return article({
      product,
      title,
      excerpt: `Knocked-down kits of ${product.name} do not skip BIS. Choose the import form, then register the finished goods on CRS.`,
      tags: ["CRS", "CKD", "SKD", "CBU", "BIS", product.category],
      slug: `crs-ckd-skd-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `Brands argue CBU versus CKD to cut duty on ${product.name}. That is a customs conversation. The compliance conversation is simpler: whatever form you import, the finished ${product.name} sold in India needs CRS on ${product.standard} (HSN ${product.hsn}).`,
        ),
        para(
          "p2",
          `CBU: register before you sell, and usually before you promise a delivery date, because a finished electronic good is easy for customs to query. CKD/SKD: import parts, assemble in India, and take the CRS manufacturer route on the Indian-built unit. Spare parts sold as parts stay out of CRS until they become a complete ${product.name}.`,
        ),
        table("t1", "Route comparison", [
          ["Form", "CRS move"],
          ["CBU from China / Vietnam", "Foreign manufacturer + AIR, or importer-owned registration"],
          ["SKD / CKD", "Indian manufacturer CRS on the assembled unit"],
          ["Spare parts only", "No CRS until the part is a finished product"],
          ["Local manufacture from local parts", "Same CRS manufacturer filing"],
        ]),
        para(
          "p3",
          `You can always go for the assembly-plus-CRS route when the commercial plan is Indian value-add. Test the unit that leaves the Indian line. ${product.timeline}, listed charges ${range(product)}.${radioNote(product)}`,
        ),
        bar("b1", "Finished goods that still need a CRS number", 100),
        spacer("s1"),
        para(
          "p4",
          `Certko will tell you which cartons are parts and which are ${product.name} before you file the Bill of Entry, then run the CRS filing that matches that choice.`,
        ),
      ],
    });
  },
  cost(product) {
    const title = `CRS cost and timeline for ${product.name}`;
    return article({
      product,
      title,
      excerpt: `Listed lab charges ${range(product)} and a ${product.timeline} window for ${product.name} CRS on ${product.standard}.`,
      tags: ["CRS", "Cost", "Timeline", "BIS", product.category],
      slug: `crs-cost-timeline-${product.slug}`.slice(0, 160),
      blocks: [
        para(
          "p1",
          `Budget CRS for ${product.name} as lab testing plus government registration charges plus labelling. The catalogue listed laboratory range for ${product.standard} is ${range(product)} excluding GST. Typical lab turnaround is ${product.timeline}.`,
        ),
        para(
          "p2",
          `Marking-fee tables on Scheme I do not apply the same way on CRS, but you still pay BIS registration fees and you still reprint cartons if the first label set is wrong. A China or Vietnam dual source doubles sample freight, not always the lab fee, if BIS accepts a series.`,
        ),
        table("t1", "Money on the table", [
          ["Line", "Indicative"],
          ["Lab testing", range(product)],
          ["Window", product.timeline],
          ["HSN", product.hsn],
          ["Standard", product.standard],
        ]),
        para(
          "p3",
          `If the listed price looks expensive, contact Certko — up to 30% lesser pricing than the listed laboratory charges is the offer we put next to every ${product.name} quote.${radioNote(product)}`,
        ),
        bar("b1", "Lab share of a first-year CRS budget", 55),
        spacer("s1"),
        para(
          "p4",
          `Ask for a single scoped quote that covers ${product.standard} testing, portal filing and the first series addition. That is cheaper than discovering a second model after the line is already painting cartons.`,
        ),
      ],
    });
  },
};

const coreIds = ["manufacture", "china", "vietnam", "assemble", "howto", "testing", "air", "ckd"];
const posts = [];

for (const product of products) {
  for (const id of coreIds) {
    posts.push(builders[id](product));
  }
}

for (const product of products.slice(0, 42)) {
  posts.push(builders.cost(product));
}

if (posts.length !== 650) {
  throw new Error(`Expected 650 posts, got ${posts.length}`);
}

const slugs = new Set();
for (const post of posts) {
  if (slugs.has(post.slug)) throw new Error(`Duplicate slug ${post.slug}`);
  slugs.add(post.slug);
}

posts.forEach((post, index) => {
  post.date = index % 2 === 0 ? "2026-09-24" : "2026-09-23";
});

const out = new URL("../src/data/generated/crs-blogs.json", import.meta.url);
writeFileSync(out, `${JSON.stringify(posts)}\n`);
console.log("wrote", posts.length, "blogs", out.pathname);
