import type { Scheme } from "./types";

export const schemes: Scheme[] = [
  {
    slug: "bis",
    name: "BIS / ISI Mark & CRS",
    shortName: "BIS",
    regulator: "Bureau of Indian Standards",
    family: "product-mark",
    countrySlugs: ["india"],
    summary:
      "India's core product certification — the ISI mark licence (Scheme I) and CRS registration (Scheme II) for products notified under Quality Control Orders.",
    process: [
      "Identify the Indian Standard and QCO status for the exact SKU / HSN.",
      "Prepare factory, quality-control and trademark documentation (AIR for foreign factories).",
      "Test samples at a BIS-recognised laboratory against every applicable clause.",
      "Factory inspection for ISI / FMCS routes; CRS is lab-test based registration.",
      "Grant of licence, Standard Mark usage and ongoing surveillance.",
    ],
    whoNeedsIt:
      "Manufacturers and importers of QCO-notified goods for the Indian market, plus tender bidders quoting an IS number.",
    pillars: ["Electrical / product safety", "Local representation (AIR)", "Filing & surveillance"],
  },
  {
    slug: "bee",
    name: "BEE Star Labelling",
    shortName: "BEE",
    regulator: "Bureau of Energy Efficiency",
    family: "energy-label",
    countrySlugs: ["india"],
    summary:
      "Mandatory star labelling for notified energy-related appliances sold in India — complementary to BIS safety certification on the same SKU.",
    process: [
      "Confirm the appliance sits on the current BEE notified list.",
      "Test energy performance at a BEE-recognised lab.",
      "Register the model, print the star label and file periodic returns.",
    ],
    whoNeedsIt: "Brands placing ACs, refrigerators, fans, LEDs, pumps and other notified appliances on the Indian market.",
    pillars: ["Energy / environment", "Labelling"],
  },
  {
    slug: "wpc-eta",
    name: "WPC / ETA",
    shortName: "WPC",
    regulator: "Wireless Planning & Coordination Wing",
    family: "radio",
    countrySlugs: ["india"],
    summary:
      "Equipment Type Approval for licence-exempt radio (Wi-Fi, Bluetooth, NFC and similar) before import or sale in India — separate from BIS.",
    process: [
      "Confirm the radio module uses a licence-exempt band.",
      "Compile RF test evidence and apply for ETA.",
      "Use the ETA number on import paperwork; stack with BIS / TEC where needed.",
    ],
    whoNeedsIt: "Any product with Wi-Fi, Bluetooth, BLE, NFC or similar unlicensed radio for India.",
    pillars: ["EMC & wireless", "Local representation"],
  },
  {
    slug: "tec-mtcte",
    name: "TEC MTCTE",
    shortName: "TEC",
    regulator: "Telecommunication Engineering Centre",
    family: "telecom",
    countrySlugs: ["india"],
    summary:
      "Mandatory Testing and Certification of Telecom Equipment — a TEC mark for gear that connects to public networks or carries an IMEI.",
    process: [
      "Classify the equipment under the current MTCTE phase.",
      "Test at a TEC-designated CAB (safety, EMC, SAR, security as applicable).",
      "File for the TEC certificate and apply the TEC mark.",
    ],
    whoNeedsIt: "Modems, routers, handsets, IoT with SIM and other public-network interfaces.",
    pillars: ["Telecom / network", "Cybersecurity"],
  },
  {
    slug: "ce",
    name: "CE Marking",
    shortName: "CE",
    regulator: "European Commission / notified bodies",
    family: "conformity-mark",
    countrySlugs: ["european-union"],
    summary:
      "Conformity marking required to place many products on the EU / EEA market — LVD, EMC, RED, RoHS and product-specific directives.",
    process: [
      "Classify the product and list applicable directives / regulations.",
      "Test to harmonised standards; involve a notified body when required.",
      "Compile the technical file, issue the EU Declaration of Conformity and affix CE.",
    ],
    whoNeedsIt: "Manufacturers and importers placing electrical, radio, machinery, toys or PPE goods on the EU / EEA market.",
    pillars: ["Electrical / product safety", "EMC & wireless", "Energy / environment"],
  },
  {
    slug: "fcc",
    name: "FCC Authorisation",
    shortName: "FCC",
    regulator: "Federal Communications Commission",
    family: "radio",
    countrySlugs: ["united-states"],
    summary:
      "US radio and EMC authorisation — SDoC or Certification depending on the equipment class, plus NRTL safety listing for many electrical goods.",
    process: [
      "Determine SDoC vs Certification (TCB) path from the equipment class.",
      "Run FCC Part 15 / Part 18 (and RF exposure) tests at an accredited lab.",
      "File, label (FCC ID where required) and keep the grant / SDoC on file.",
    ],
    whoNeedsIt: "Electronics, radio and IT equipment entering the United States.",
    pillars: ["EMC & wireless", "Electrical / product safety"],
  },
  {
    slug: "g-mark",
    name: "G-Mark (Gulf Conformity)",
    shortName: "GMARK",
    regulator: "GSO / notified bodies",
    family: "conformity-mark",
    countrySlugs: ["gcc", "united-arab-emirates", "kuwait", "oman", "saudi-arabia"],
    summary:
      "Gulf Conformity Mark pathways across GSO member states for listed household appliances, toys and some electrical accessories.",
    process: [
      "Map the SKU to the GSO technical regulation list.",
      "Reuse CE / IEC evidence where accepted; close Gulf national differences.",
      "Appoint a Gulf representative, obtain the G-Mark and register the certificate.",
    ],
    whoNeedsIt: "Exporters of listed appliances, toys and electrical accessories into GCC states.",
    pillars: ["Electrical / product safety", "Local representation"],
  },
  {
    slug: "saber",
    name: "SABER / SASO",
    shortName: "SABER",
    regulator: "SASO / Saber platform",
    family: "pre-shipment",
    countrySlugs: ["saudi-arabia"],
    summary:
      "Saudi product registration and per-shipment conformity certificates on the Saber platform — often stacked with G-Mark or SASO technical regulations.",
    process: [
      "Register the product and the Saudi importer on Saber.",
      "Obtain a Product Certificate of Conformity (PCoC) from a notified body.",
      "Issue a Shipment Certificate of Conformity (SCoC) for every consignment.",
    ],
    whoNeedsIt: "Any brand shipping regulated consumer or electrical goods into Saudi Arabia.",
    pillars: ["Filing & follow-up", "Local representation", "Pre-shipment CoC"],
  },
  {
    slug: "ukca",
    name: "UKCA",
    shortName: "UKCA",
    regulator: "OPSS / UK approved bodies",
    family: "conformity-mark",
    countrySlugs: ["united-kingdom"],
    summary:
      "UK Conformity Assessed marking. Most CE evidence can be reused, but filings and the UK responsible person are separate.",
    process: [
      "Confirm whether CE is still accepted for the product class or UKCA is required.",
      "Reuse the LVD / EMC / RED package; close UK designated-standard gaps.",
      "Appoint a UK responsible person and hold the technical file.",
    ],
    whoNeedsIt: "Brands placing goods on the Great Britain market after Brexit transition rules.",
    pillars: ["Electrical / product safety", "Local representation"],
  },
  {
    slug: "rcm",
    name: "RCM (EESS + ACMA)",
    shortName: "RCM",
    regulator: "EESS / ACMA",
    family: "conformity-mark",
    countrySlugs: ["australia", "new-zealand"],
    summary:
      "Regulatory Compliance Mark covering electrical safety (EESS) and EMC / radiocommunications (ACMA) for Australia and New Zealand.",
    process: [
      "Classify in-scope electrical and radio equipment.",
      "Test to AS/NZS (often aligned with IEC / FCC suites).",
      "Register on the EESS database and apply the RCM.",
    ],
    whoNeedsIt: "Electrical and radio equipment suppliers for Australia and New Zealand.",
    pillars: ["Electrical / product safety", "EMC & wireless"],
  },
  {
    slug: "eac",
    name: "EAC (EAEU)",
    shortName: "EAC",
    regulator: "Eurasian Economic Union",
    family: "conformity-mark",
    countrySlugs: ["eaeu", "kazakhstan", "uzbekistan"],
    summary:
      "One EAC certificate or declaration can cover the EAEU bloc — safety, EMC and often energy, with a local applicant.",
    process: [
      "Identify the applicable TR CU / TR EAEU technical regulation.",
      "Test at an accredited EAEU laboratory.",
      "Register the certificate/declaration with a union applicant.",
    ],
    whoNeedsIt: "Exporters into Russia-adjacent EAEU markets and Kazakhstan.",
    pillars: ["Electrical / product safety", "Regional bloc"],
  },
];
