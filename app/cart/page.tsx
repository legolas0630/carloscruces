import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

const cartItems = [
  { id: 1, name: "Asfalto Tee", price: "€35", qty: 1 },
  { id: 2, name: "Cruces Hoodie", price: "€85", qty: 2 },
  { id: 3, name: "Sticker Pack", price: "€12", qty: 1 },
];

export default function CartPage() {
  const subtotal = "€217";
  const shipping = "€8";
  const total = "€225";

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-4xl">
        <SectionHeader label="VIEW CART" sub="YOUR ITEMS · ORDER SUMMARY" />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                Items in cart
              </div>
              <Link
                href="/merch"
                className="text-[0.65rem] tracking-[0.3em] uppercase text-[#777] hover:text-[#a8ff00] transition-colors"
              >
                Continue shopping
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border border-[#1a1a1a] rounded-sm p-4 bg-[#0a0a0a]"
                >
                  <div>
                    <div className="text-base sm:text-lg tracking-[0.1em] text-[#f0f0f0]">
                      {item.name}
                    </div>
                    <div className="mt-1 text-[0.65rem] tracking-[0.25em] uppercase text-[#666]">
                      Quantity {item.qty}
                    </div>
                  </div>
                  <div className="text-sm sm:text-base tracking-[0.15em] text-[#a8ff00]">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8 h-fit">
            <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
              Summary
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between text-[#999]">
                <span>Subtotal</span>
                <span>{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-[#999]">
                <span>Shipping</span>
                <span>{shipping}</span>
              </div>
              <div className="border-t border-[#1a1a1a] pt-3 flex items-center justify-between text-[#f0f0f0]">
                <span>Total</span>
                <span className="text-[#a8ff00]">{total}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-8 inline-flex w-full items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              PROCEED TO CHECKOUT
            </Link>

            <Link
              href="/logout/successful"
              className="mt-3 inline-flex w-full items-center justify-center rounded-sm border border-[#222] bg-transparent px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#f0f0f0] transition-colors hover:border-[#a8ff00] hover:text-[#a8ff00]"
            >
              LOG OUT
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
