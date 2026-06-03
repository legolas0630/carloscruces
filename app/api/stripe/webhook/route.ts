import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Next.js Build-Stage Guardrail
 * Prevents static pre-rendering loops from throwing initialization panics
 * if keys aren't explicitly loaded into environment buffers at build time.
 */
const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder_for_build_validation");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasAdminConfig = !!(supabaseUrl && serviceKey);

const supabaseAdmin = createClient(
  hasAdminConfig ? supabaseUrl! : "https://placeholder-id.supabase.co",
  hasAdminConfig ? serviceKey! : "placeholder-key-for-build-validation"
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Missing webhook signature or token layout" }, { status: 400 });
    }
    
    // 1. Verify that the request came untampered directly from Stripe's network
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Verification Error: ${err.message}` }, { status: 400 });
  }

  // 2. Intercept the checkout fulfillment hook event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract un-tamperable variables out of Stripe's encrypted secure data block
    const buyerEmail = session.metadata?.user_email; 
    const stripePaymentId = session.id;
    const amountInDollars = (session.amount_total || 0) / 100; // Convert cents back to flat decimal string format

    console.log(`💰 Stripe Payment Verified Approved for Session: ${stripePaymentId}`);

    if (buyerEmail) {
      if (!hasAdminConfig) {
        console.error("💥 ADMIN RUNTIME ERROR: Core database keys missing from live service memory arrays.");
        return NextResponse.json({ error: "Database configuration error" }, { status: 500 });
      }

      try {
        // 3. Idempotency Guard: Stop double-insertion execution loops if Stripe fires duplicate retry pings
        const { data: existingPurchase } = await supabaseAdmin
          .from("purchases")
          .select("id")
          .eq("payment_id", stripePaymentId)
          .maybeSingle();

        if (!existingPurchase) {
          const currentStamp = new Date().toISOString();

          // 4. Commit verified purchase parameters into your ledger table architecture
          const { error: insertError } = await supabaseAdmin
            .from("purchases")
            .insert([
              {
                user_email: buyerEmail,
                payment_id: stripePaymentId,
                amount: Number(amountInDollars),
                description: "AUDIO FREQUENCIES MANIFEST (STRIPE)",
                status: "FULFILLED",
                date: currentStamp
              }
            ]);

          if (insertError) {
            console.error("❌ Ledger Database insertion failure:", insertError);
            // Return 200 to acknowledge structure and prevent endless webhook payload queues from backing up
            return NextResponse.json({ error: "Internal Database write logged" }, { status: 200 });
          }

          console.log(`📡 Database Synchronized: Purchase row mapped to consumer endpoint node: ${buyerEmail}`);
        } else {
          console.log(`ℹ️ Stripe Session ID ${stripePaymentId} already synchronized. Execution skipped.`);
        }
      } catch (dbErr) {
        console.error("💥 Critical internal process crash during database pipeline sequence:", dbErr);
      }
    }
  }

  // Stripe requires a clean HTTP 200 acknowledgement to verify the socket is closed successfully
  return NextResponse.json({ received: true }, { status: 200 });
}