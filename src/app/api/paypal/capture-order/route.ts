import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  studentId?: string | null;
  major?: string | null;
  graduationYear?: string | null;
}

type MembershipType = "yearly" | "semesterly";

interface CaptureRequestBody {
  orderID: string;
  userData: UserData;
  membershipType?: MembershipType;
}

export async function POST(req: Request) {
  try {
    const {
      orderID,
      userData,
      membershipType = "yearly",
    }: CaptureRequestBody = await req.json();

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    if (
      !userData ||
      !userData.firstName ||
      !userData.lastName ||
      !userData.email
    ) {
      return NextResponse.json(
        { error: "User data is required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.PAYPAL_API_BASE_URL || "https://api-m.sandbox.paypal.com";
    const captureResponse = await fetch(
      `${baseUrl}/v2/checkout/orders/${orderID}/capture`,
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
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error("PayPal capture error:", captureData);
      return NextResponse.json(
        { error: "Failed to capture PayPal payment" },
        { status: captureResponse.status }
      );
    }

    if (captureData.status === "COMPLETED") {
      const paypalEmail = captureData.payer?.email_address || null;

      const captureId =
        captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

      const amount = parseFloat(
        captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount
          ?.value || "25.00"
      );

      const currency =
        captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount
          ?.currency_code || "USD";

      const supabase = await createClient();
      // member_id in the table is equivalent to student_id from the form
      const { data: paymentData, error: insertError } = await supabase
        .from("paypal_payments")
        .insert([
          {
            paypal_order_id: orderID,
            paypal_capture_id: captureId,
            paypal_email: paypalEmail,
            member_id: userData.studentId || null,
            status: "COMPLETED",
            amount: amount,
            currency: currency,
            membership_type: membershipType,
            raw_response: captureData,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return NextResponse.json(
          {
            error:
              "Payment successful but failed to record. Please contact support.",
            paymentCaptured: true,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        status: "success",
        payment: paymentData,
      });
    }

    return NextResponse.json(
      { error: "Payment was not completed", status: captureData.status },
      { status: 400 }
    );
  } catch (error) {
    console.error("Capture order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
