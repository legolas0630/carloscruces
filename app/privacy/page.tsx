import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-zinc-400 font-mono selection:bg-zinc-800 selection:text-white px-6 py-20 max-w-3xl mx-auto space-y-12">
      {/* Brand Header */}
      <header className="border-b border-zinc-800 pb-6">
        <Link href="/" className="text-xs text-zinc-600 hover:text-white transition-colors">&lt; RETURN_TO_CORE_TERMINAL</Link>
        <h1 className="text-xl text-white font-bold mt-4 tracking-wider">// PRIVACY_POLICY_MANIFEST</h1>
        <p className="text-xs text-zinc-500 mt-1">LAST_SYNCHRONIZED: June 2026</p>
      </header>

      {/* Manifest Content Chunks */}
      <section className="space-y-6 text-sm leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-white text-xs tracking-widest uppercase font-bold">[01] DATA_COLLECTION_PROTOCOLS</h2>
          <p>
            When navigating our terminal network, we collect the basic profile information provided natively during your identity handshake via Google OAuth (specifically your verified email address and public name). This data is stored strictly to map purchase transactions and authorize your access privileges.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-white text-xs tracking-widest uppercase font-bold">[02] PAYMENT_GATEWAY_ISOLATION</h2>
          <p>
            Financial processing transactions are routed natively through encrypted third-party ledgers (Stripe and Mercado Pago). Our local infrastructure never stores, transmits, or logs your raw payment credentials or credit card numbers. Your billing profiles remain isolated within their secure banking arrays.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-white text-xs tracking-widest uppercase font-bold">[03] COOKIES & EDGE SECURITY</h2>
          <p>
            We deploy secure session storage blocks and analytical diagnostic tracking parameters exclusively to maintain your authenticated node status across our application routing loops. We never leverage cross-site advertisement scripts or sell your account metadata to external data brokers.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-white text-xs tracking-widest uppercase font-bold">[04] ACCOUNT_PURGE_REQUESTS</h2>
          <p>
            You retain absolute authority over your data profile rows. If you wish to permanently purge your profile ledger, transaction mappings, or clearing logs from our Supabase tables, contact us directly at your central administrator email address.
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