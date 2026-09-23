import { Link } from "@/i18n/navigation";
import type { CookieSettings } from "@/data/site-settings";
import { CookieSettingsButton } from "./cookie-banner";

export function CookieInventory({ settings }: { settings: CookieSettings }) {
  return (
    <div className="mx-auto mt-8 max-w-3xl px-4 pb-10">
      <h2 className="font-display text-navy">Cookie inventory</h2>
      <p className="mt-2 text-muted">
        Last reviewed {settings.lastReviewed || "—"}. Necessary cookies stay on. Analytics and marketing stay off until you allow them.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-3">Cookie</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Duration</th>
              <th className="py-2">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {settings.rows.map((row) => (
              <tr key={row.id} className="border-b border-line/70 align-top">
                <td className="py-2 pr-3 font-medium">{row.name}</td>
                <td className="py-2 pr-3 capitalize">{row.category}</td>
                <td className="py-2 pr-3">{row.duration}</td>
                <td className="py-2">{row.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">
        Change your choice anytime via <CookieSettingsButton />. Rights requests go to{" "}
        <Link href={settings.dataRequestPath} className="underline">
          the data-request form
        </Link>{" "}
        or {settings.controllerEmail}.
      </p>
    </div>
  );
}

export function GdprCompare({ settings }: { settings: CookieSettings }) {
  return (
    <div className="mx-auto mt-8 max-w-3xl px-4 pb-10">
      <h2 className="font-display text-navy">How they compare</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-3">Topic</th>
              <th className="py-2 pr-3">GDPR (EU / UK)</th>
              <th className="py-2">DPDP Act (India)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Geography", "EU / EEA, and UK GDPR", "Digital personal data in India"],
              ["You are", "Data subject", "Data Principal"],
              ["Certko is", "Controller (and processor where a partner decides)", "Data Fiduciary (and Data Processor where instructed)"],
              ["Cookies", "Consent before non-essential tracking", "Consent and notice for personal data use"],
              ["Rights", "Access, correction, erasure, restriction, portability, objection", "Access, correction, erasure, withdraw consent"],
              ["Complaint", "Your local supervisory authority", "Data Protection Board of India after the grievance officer"],
            ].map(([topic, gdpr, dpdp]) => (
              <tr key={topic} className="border-b border-line/70 align-top">
                <td className="py-2 pr-3 font-medium">{topic}</td>
                <td className="py-2 pr-3">{gdpr}</td>
                <td className="py-2">{dpdp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">
        Raise a request with {settings.grievanceOfficer || "the Privacy Officer"} at {settings.dpoEmail || settings.controllerEmail} or use{" "}
        <Link href={settings.dataRequestPath} className="underline">
          the data-request form
        </Link>
        .
      </p>
    </div>
  );
}

export function LegalReviewed({ settings }: { settings: CookieSettings }) {
  if (!settings.lastReviewed) return null;
  return <p className="caption mt-2 text-muted">Last reviewed {settings.lastReviewed} · Consent version {settings.consentVersion}</p>;
}
