import { NextResponse } from "next/server";

interface CreateOrderRequest {
  amount: string;
  description: string;
}

export async function POST(req: Request) {
  try {
    const body: CreateOrderRequest = await req.json();
    const { amount, description } = body;

    const validAmounts = ["25.00", "15.00"];
    if (!validAmounts.includes(amount)) {
      return NextResponse.json(
        { error: "Invalid membership amount" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.PAYPAL_API_BASE_URL || "https://api-m.sandbox.paypal.com";
    const response = await fetch(`${baseUrl}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID +
              ":" +
              process.env.PAYPAL_CLIENT_SECRET
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: description || "ACM Chapter Membership Dues",
              amount: {
                currency_code: "USD",
                value: amount,
              },
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal create order error:", data);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
