import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-4xl">
        <SectionHeader label="CHECK OUT" sub="SHIPPING · PAYMENT · REVIEW" />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8 grid gap-6">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                  Full name
                </span>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00]"
                />
              </div>

              <div className="grid gap-2">
                <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                  Email
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00]"
                />
              </div>

              <div className="grid gap-2">
                <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                  Address
                </span>
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00]"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00]"
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00]"
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                Payment
              </div>
              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00]"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00]"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/checkout/successful"
                className="inline-flex items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                PLACE ORDER
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-sm border border-[#222] bg-transparent px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#f0f0f0] transition-colors hover:border-[#a8ff00] hover:text-[#a8ff00]"
              >
                BACK TO CART
              </Link>
            </div>
          </form>

          <aside className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8 h-fit">
            <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
              Order summary
            </div>

            <div className="mt-6 grid gap-3 text-sm text-[#999]">
              <div className="flex items-center justify-between">
                <span>Products</span>
                <span>4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>€8</span>
              </div>
              <div className="border-t border-[#1a1a1a] pt-3 flex items-center justify-between text-[#f0f0f0]">
                <span>Total</span>
                <span className="text-[#a8ff00]">€225</span>
              </div>
            </div>

            <div className="mt-8 text-[0.7rem] leading-6 tracking-[0.18em] uppercase text-[#555]">
              Secure checkout. No hidden fees. Limited drops only.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
