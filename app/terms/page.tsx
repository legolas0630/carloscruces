import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-black text-zinc-400 font-mono selection:bg-zinc-800 selection:text-white px-6 py-20 max-w-3xl mx-auto space-y-12">
      {/* Brand Header */}
      <header className="border-b border-zinc-800 pb-6">
        <Link href="/" className="text-xs text-zinc-600 hover:text-white transition-colors">&lt; RETURN_TO_CORE_TERMINAL</Link>
        <h1 className="text-xl text-white font-bold mt-4 tracking-wider">// TERMS_OF_SERVICE_MATRIX</h1>
        <p className="text-xs text-zinc-500 mt-1">LAST_SYNCHRONIZED: June 2026</p>
      </header>

      {/* Terms Content Chunks */}
      <section className="space-y-6 text-sm leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-white text-xs tracking-widest uppercase font-bold">[01] DIGITAL_ASSET_LICENSING</h2>
          <p>
            All audio frequencies, sound packages, stems, master WAV configurations, and visual graphics distributed through this platform are provided as non-transferable licenses. Purchasing digital goods authorizes personal or authorized commercial usage dependent on your specific clearance level tier, but does not transfer intellectual copyright ownership.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-white text-xs tracking-widest uppercase font-bold">[02] REFUND_POLICY_EXCLUSION</h2>
          <p>
            Due to the immutable nature of digital distribution systems, all transactions processed through our Stripe or Mercado Pago portals for software configurations, audio downloads, or immediate license provisions are final and non-refundable.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-white text-xs tracking-widest uppercase font-bold">[03] SYSTEM_INTEGRITY & NODE ETHICS</h2>
          <p>
            You agree not to bypass our Row Level Security (RLS) policies, deploy automated bot scrapers against our download vaults, or forge signature payloads targeting our billing endpoints. Violations of server-side integrity will result in an immediate block of your authenticated account node.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-white text-xs tracking-widest uppercase font-bold">[04] MODIFICATIONS TO SCHEMAS</h2>
          <p>
            We reserve the right to alter file distributions, adjust ambient catalog availability, or update security parameters inside this system network matrix at any point without prior notice strings.
          </p>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="border-t border-zinc-900 pt-6 text-center text-xs text-zinc-600">
        carloscruces.space © 2026 · ALL_PRIVILEGES_RESERVED
      </footer>
    </main>
  );
}