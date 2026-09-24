"use client";

import { useState } from "react";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [stamp, setStamp] = useState(() => Date.now());
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  function refreshCaptcha() {
    setCaptcha("");
    setStamp(Date.now());
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, captcha }),
    });
    const json = (await response.json().catch(() => null)) as { error?: string } | null;
    setBusy(false);
    if (!response.ok) {
      setStatus(json?.error || "Sign in failed.");
      refreshCaptcha();
      return;
    }
    window.location.assign(nextPath);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-white outline-none ring-gold/40 placeholder:text-white/35 focus:ring-2"
          placeholder="name@company.com"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-white outline-none ring-gold/40 focus:ring-2"
        />
      </label>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">Characters</span>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/auth/captcha?t=${stamp}`}
            alt="Type the characters shown"
            width={220}
            height={72}
            className="h-[72px] w-[220px] rounded-lg border border-white/10"
          />
          <button
            type="button"
            onClick={refreshCaptcha}
            className="type-btn rounded-md border border-white/20 px-3 py-1.5 text-white/80 hover:border-gold hover:text-gold"
          >
            New characters
          </button>
        </div>
        <input
          type="text"
          name="captcha"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          required
          minLength={4}
          maxLength={8}
          value={captcha}
          onChange={(event) => setCaptcha(event.target.value.toUpperCase())}
          className="mt-3 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 tracking-[0.35em] text-white outline-none ring-gold/40 placeholder:tracking-normal placeholder:text-white/35 focus:ring-2"
          placeholder="ABC12"
          aria-label="Enter the characters from the image"
        />
      </div>
      {status ? (
        <p className="rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100" role="alert">
          {status}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="type-btn w-full rounded-full bg-gold px-4 py-2.5 font-semibold text-navy hover:bg-gold-600 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
