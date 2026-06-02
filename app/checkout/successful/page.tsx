import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export default function CheckoutSuccessfulPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-2xl">
        <SectionHeader label="CHECKOUT SUCCESSFUL" sub="ORDER CONFIRMED · THANK YOU" />

        <div className="mt-12 bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8">
          <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
            Confirmation
          </div>
          <div className="mt-3 text-2xl sm:text-3xl tracking-[0.12em] text-[#a8ff00]">
            Your order is on the way.
          </div>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-[#999] font-normal">
            We have received your checkout details and started processing the order.
            You’ll get an email confirmation shortly.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-[#999]">
            <div className="flex items-center justify-between">
              <span>Order number</span>
              <span className="text-[#f0f0f0]">CC-2026-0147</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="text-[#a8ff00]">Processing</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/merch"
              className="inline-flex items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              CONTINUE SHOPPING
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-sm border border-[#222] bg-transparent px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#f0f0f0] transition-colors hover:border-[#a8ff00] hover:text-[#a8ff00]"
            >
              RETURN HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
