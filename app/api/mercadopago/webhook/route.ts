import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

// Initialize the Mercado Pago SDK client
const mpClient = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "" 
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Next.js Build Guardrail Configuration
 * Prevents static analysis worker tracks from crashing with an 'undefined key' 
 * error if your environment variables aren't initialized at compilation time.
 */
const hasAdminConfig = !!(supabaseUrl && serviceKey);

const supabaseAdmin = createClient(
  hasAdminConfig ? supabaseUrl! : "https://placeholder-id.supabase.co",
  hasAdminConfig ? serviceKey! : "placeholder-key-for-build-validation"
);

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secretParam = url.searchParams.get("secret");
    
    // 1. Secure webhook endpoint against unauthorized or fake pings
    if (!secretParam || secretParam !== process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized endpoint request" }, { status: 401 });
    }

    // Defensive catch wrap to prevent raw payload parsing drops
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response("Malformed payload syntax structure", { status: 400 });
    }
    
    // 2. Intercept targeted payment lifecycle actions
    if (body?.action === "payment.created" || body?.type === "payment" || body?.action === "payment.updated") {
      const paymentId = body.data?.id || body.id;

      if (paymentId) {
        // Fetch full untampered transaction records directly from Mercado Pago's cloud ledger
        const paymentInstance = new Payment(mpClient);
        const paymentData = await paymentInstance.get({ id: String(paymentId) });

        if (paymentData?.status === "approved") {
          const buyerEmail = paymentData.external_reference; // Extracted email profile token
          const transactionAmount = paymentData.transaction_amount;

          console.log(`✅ Verified Approved Payment: ${paymentId} for ${buyerEmail}`);

          if (buyerEmail) {
            // Fail-safe protection inside live production runtimes if configs fail to stream
            if (!hasAdminConfig) {
              console.error("💥 GATEWAY RUNTIME CRASH: Administrative credential keys missing from runtime memory.");
              return new Response("Service configuration missing", { status: 500 });
            }

            // 3. Idempotency Check: Verify if this payment ID has already been processed to prevent duplicates
            const { data: existingPurchase } = await supabaseAdmin
              .from("purchases")
              .select("id")
              .eq("payment_id", String(paymentId))
              .maybeSingle();

            if (!existingPurchase) {
              const currentStamp = new Date().toISOString();

              // 4. Provision and commit the new order ledger to the database matching your layout tracking values
              const { error: insertError } = await supabaseAdmin
                .from("purchases")
                .insert([
                  {
                    user_email: buyerEmail,
                    payment_id: String(paymentId),
                    amount: Number(transactionAmount),
                    description: "AUDIO FREQUENCIES MANIFEST",
                    status: "FULFILLED",
                    date: currentStamp
                  }
                ]);

              if (insertError) {
                console.error("❌ Ledger Database insertion failure:", insertError);
                // Return 200 so Mercado Pago pauses retries while you inspect your column configurations
                return new Response("Database write error recorded", { status: 200 });
              }

              console.log(`📡 Database Updated: Purchase ledger securely bound to terminal ${buyerEmail}`);
            } else {
              console.log(`ℹ️ Payment ID ${paymentId} already synchronized. Skipping processing.`);
            }
          }
        }
      }
    }

    // Mercado Pago strictly requires an immediate HTTP 200 OK status acknowledgment to halt notification loops
    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("💥 Mercado Pago Webhook Processing Loop Crash:", error);
    // Keep responding with a 200 on structured catch exceptions to handle validation anomalies gracefully
    return new Response("Webhook logged with structural anomaly handler", { status: 200 });
  }
}