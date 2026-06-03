import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

/**
 * Next.js Build-Stage Guardrail
 * Instantiates the SDK with a clean fallback mask string so static pre-rendering 
 * routes don't crash with an unhandled initialization throw during npm run build.
 */
const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder_for_build_validation");

export async function POST(req: Request) {
  try {
    // 1. Intercept Request with Secure Native Supabase Cookie Check
    const supabase = createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: "Unauthorized Node Access" }, { status: 401 });
    }

    const { amount } = await req.json();
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount value" }, { status: 400 });
    }

    // Runtime runtime check to catch unconfigured server parameters instantly
    if (!stripeSecretKey) {
      console.error("💥 STRIPE GATEWAY ERROR: STRIPE_SECRET_KEY missing from system memory.");
      return NextResponse.json({ error: "Payment Gateway Misconfigured" }, { status: 500 });
    }

    // 2. Stripe expects token value in CENTS (e.g., $10.00 = 1000 cents)
    const amountInCents = Math.round(parsedAmount * 100);

    // 3. Compute execution origin paths dynamically on the fly
    const { origin } = new URL(req.url);

    // 4. Construct Secure Session Payload
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email, // Direct auto-fill hook for the secure payment view panel
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Audio Frequencies / Support Manifest",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        user_email: user.email, // CRITICAL: Allows your incoming webhook listener to locate the buyer's account
      },
      success_url: `${origin}/checkout/successful?amount=${parsedAmount}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Stripe Checkout Full Failure Diagnostics:", error);
    return NextResponse.json(
      { error: "Internal Gateway Routing Error", details: error.message }, 
      { status: 500 }
    );
  }
}