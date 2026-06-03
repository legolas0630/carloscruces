import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createServerSupabase } from "@/lib/supabase/server";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "" 
});

export async function POST(req: Request) {
  try {
    // 1. Secure the Gateway with Native Supabase Cookie Check
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

    // 2. Compute Dynamic Redirection Origins (No more hardcoded localhosts)
    const { origin } = new URL(req.url);

    const preferenceInstance = new Preference(client);
    
    // 3. Build Safe, Auditable Production Payload
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
        payer: {
          email: user.email,
        },
        back_urls: {
          success: `${origin}/checkout/successful`,
          failure: `${origin}/checkout`,
          pending: `${origin}/checkout`,
        },
        // Safely re-enabled now that urls adjust to live production domains dynamically
        auto_return: "approved", 
        // Crucial: Pass user email as the audit key so webhooks can instantly locate the buyer
        external_reference: user.email,
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