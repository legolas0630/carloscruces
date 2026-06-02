import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acorn" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const customerEmail = session.customer_details?.email;
      const metadata = session.metadata;

      console.log("💰 Payment Confirmed:", {
        email: customerEmail,
        item: metadata?.title,
        trackId: metadata?.trackId
      });

      // INTEGRATION: Call your email service here (e.g. Resend)
      // await sendConfirmationEmail(customerEmail, metadata);
    }
  }

  return NextResponse.json({ received: true });
}
