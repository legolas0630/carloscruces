import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! 
});

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Optional: Secure webhook against generic pings by adding a secret token to your webhook query parameters 
    // e.g. https://yourdomain.com/api/mercadopago/webhook?secret=your_custom_secret_token
    const secretParam = searchParams.get("secret");
    if (secretParam !== process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
       return NextResponse.json({ error: "Unauthorized endpoint request" }, { status: 401 });
    }

    const body = await req.json();
    
    // Mercado Pago sends different event types; we want payment creations/updates
    if (body.action === "payment.created" || body.type === "payment") {
      const paymentId = body.data?.id || body.id;

      if (paymentId) {
        // Fetch full transaction details directly from Mercado Pago safely
        const paymentInstance = new Payment(client);
        const paymentData = await paymentInstance.get({ id: paymentId });

        if (paymentData.status === "approved") {
          console.log(`✅ Mercado Pago Payment Approved: ${paymentId}`);
          console.log(`Amount: $${paymentData.transaction_amount}`);
          console.log(`External Reference Context: ${paymentData.external_reference}`);
          
          // TODO: Process item fulfillment or database records safely here
        }
      }
    }

    // Mercado Pago strictly requires an immediate HTTP 200 OK status acknowledgment
    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("Mercado Pago Webhook Error:", error);
    // Keep responding with 200 to halt endless notification loop errors if format is valid
    return new Response("Webhook Error", { status: 200 });
  }
}