import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "" 
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount value" }, { status: 400 });
    }

    const preferenceInstance = new Preference(client);
    
    // Simplified production payload shape
    const response = await preferenceInstance.create({
      body: {
        items: [
          {
            id: "frequencies-allocation",
            title: "Audio Frequencies Manifest",
            quantity: 1,
            unit_price: Number(parsedAmount.toFixed(2)), 
            currency_id: "MXN", 
          },
        ],
        back_urls: {
          success: "http://localhost:3000/checkout/successful",
          failure: "http://localhost:3000/checkout",
          pending: "http://localhost:3000/checkout",
        },
        // We commented this out to stop their API validation firewall from throwing errors on localhost paths
        // auto_return: "approved", 
        external_reference: String(parsedAmount),
      }
    });

    const redirectUrl = response.init_point || response.sandbox_init_point;

    if (!redirectUrl) {
      throw new Error("No redirection targets returned from Mercado Pago.");
    }

    return NextResponse.json({ url: redirectUrl });
  } catch (error: any) {
    console.error("❌ Mercado Pago Preference Full Failure Diagnostics:", error);
    return NextResponse.json(
      { error: "Internal Gateway Routing Error", details: error.message }, 
      { status: 500 }
    );
  }
}